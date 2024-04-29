use serde_json::Value;

use crate::{api::EmptyResult, db::DbConn, error::MapResult, db::models::two_factor::TwoFactorType};

db_object! {
    #[derive(Identifiable, Queryable, Insertable, AsChangeset)]
    #[diesel(table_name = twofactor_admin)]
    #[diesel(primary_key(uuid))]
    pub struct TwoFactorAdmin {
        pub uuid: String,
        pub atype: i32,
        pub enabled: bool,
        pub data: String,
        pub last_used: i64,
    }
}

/// Local methods
impl TwoFactorAdmin {
    pub fn new(atype: TwoFactorType, data: String) -> Self {
        Self {
            uuid: crate::util::get_uuid(),
            atype: atype as i32,
            enabled: true,
            data,
            last_used: 0,
        }
    }

    pub fn to_json(&self) -> Value {
        json!({
            "Enabled": self.enabled,
            "Key": "", // This key and value vary
            "Object": "twoFactorAuthenticator" // This value varies
        })
    }

    pub fn to_json_provider(&self) -> Value {
        json!({
            "Enabled": self.enabled,
            "Type": self.atype,
            "Object": "twoFactorProvider"
        })
    }
}

/// Database methods
impl TwoFactorAdmin {
    pub async fn save(&self, conn: &mut DbConn) -> EmptyResult {
        db_run! { conn:
            sqlite, mysql {
                match diesel::replace_into(twofactor_admin::table)
                    .values(TwoFactorAdminDb::to_db(self))
                    .execute(conn)
                {
                    Ok(_) => Ok(()),
                    // Record already exists and causes a Foreign Key Violation because replace_into() wants to delete the record first.
                    Err(diesel::result::Error::DatabaseError(diesel::result::DatabaseErrorKind::ForeignKeyViolation, _)) => {
                        diesel::update(twofactor_admin::table)
                            .filter(twofactor_admin::uuid.eq(&self.uuid))
                            .set(TwoFactorAdminDb::to_db(self))
                            .execute(conn)
                            .map_res("Error saving twofactor")
                    }
                    Err(e) => Err(e.into()),
                }.map_res("Error saving twofactor")
            }
            postgresql {
                let value = TwoFactorAdminDb::to_db(self);
                // We need to make sure we're not going to violate the unique constraint on user_uuid and atype.
                // This happens automatically on other DBMS backends due to replace_into(). PostgreSQL does
                // not support multiple constraints on ON CONFLICT clauses.
                diesel::delete(twofactor_admin::table.filter(twofactor::atype.eq(&self.atype)))
                    .execute(conn)
                    .map_res("Error deleting twofactor for insert")?;

                diesel::insert_into(twofactor_admin::table)
                    .values(&value)
                    .on_conflict(twofactor::uuid)
                    .do_update()
                    .set(&value)
                    .execute(conn)
                    .map_res("Error saving twofactor")
            }
        }
    }

    pub async fn delete(self, conn: &mut DbConn) -> EmptyResult {
        db_run! { conn: {
            diesel::delete(twofactor_admin::table.filter(twofactor_admin::uuid.eq(self.uuid)))
                .execute(conn)
                .map_res("Error deleting twofactor")
        }}
    }

    pub async fn find_by_type(atype: i32, conn: &mut DbConn) -> Option<Self> {
        db_run! { conn: {
            twofactor_admin::table
                .filter(twofactor_admin::atype.eq(atype))
                .first::<TwoFactorAdminDb>(conn)
                .ok()
                .from_db()
        }}
    }

    pub async fn delete_all(conn: &mut DbConn) -> EmptyResult {
        db_run! { conn: {
            diesel::delete(twofactor_admin::table)
                .execute(conn)
                .map_res("Error deleting twofactors")
        }}
    }
}