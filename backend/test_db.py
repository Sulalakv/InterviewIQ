from sqlalchemy import text
from app.database.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))

        print("✅ Database Connected Successfully!\n")

        for row in result:
            print("PostgreSQL Version:")
            print(row[0])

except Exception as e:
    print("❌ Database Connection Failed!")
    print(e)