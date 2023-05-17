import pandas as pd
import mysql.connector
from mysql.connector import Error
import re


def sanitize_column_name(column):
    sanitized_column = re.sub(r"\W+", "_", column).strip("_")
    while sanitized_column[0].isdigit():
        sanitized_column = "_" + sanitized_column
    return sanitized_column


mysql_host = "localhost"
mysql_port = 3306
mysql_user = "root"
mysql_password = "password"
database_name = "stellardb"

csv_file = "data.csv"
print("Reading CSV file...")
df = pd.read_csv(csv_file, low_memory=False)
df.columns = [sanitize_column_name(col) for col in df.columns]

group_1_columns = df.columns[: len(df.columns) // 2]
group_2_columns = df.columns[len(df.columns) // 2 :]

try:
    print("Connecting to MySQL container...")
    connection = mysql.connector.connect(
        host=mysql_host,
        port=mysql_port,
        user=mysql_user,
        password=mysql_password,
        database=database_name,
    )

    if connection.is_connected():
        cursor = connection.cursor()
        cursor.execute("USE stellardb;")

        print("Dropping existing tables...")
        cursor.execute("DROP TABLE IF EXISTS properties_group_1;")
        cursor.execute("DROP TABLE IF EXISTS properties_group_2;")
        cursor.execute("DROP TABLE IF EXISTS properties;")
        connection.commit()

        print("Creating main table... This will take 5 minutes")
        main_table_name = "properties"
        create_main_table_query = (
            f"CREATE TABLE {main_table_name} (id INT AUTO_INCREMENT PRIMARY KEY)"
        )
        cursor.execute(create_main_table_query)
        connection.commit()

        def create_related_table(group_name, group_columns, main_table_name):
            print(f"Creating related table {group_name}...")
            table_name = f"{main_table_name}_{group_name}"
            create_table_query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, main_id INT, FOREIGN KEY (main_id) REFERENCES {main_table_name}(id)"
            column_definitions = []

            for column in group_columns:
                dtype = df[column].dtype
                sanitized_column = sanitize_column_name(column)
                mysql_dtype = ""
                if "int" in str(dtype):
                    mysql_dtype = "INT"
                elif "float" in str(dtype):
                    mysql_dtype = "FLOAT"
                elif "object" in str(dtype):
                    mysql_dtype = "TEXT"
                elif "bool" in str(dtype):
                    mysql_dtype = "TINYINT(1)"
                column_definitions.append(f"{sanitized_column} {mysql_dtype}")

            create_table_query += ", " + ", ".join(column_definitions) + ")"
            cursor.execute(create_table_query)
            connection.commit()

            print(f"Inserting data into related table {group_name}...")
            for _, row in df[group_columns].iterrows():
                row_values = tuple(row.values)
                row_values = tuple(
                    None if pd.isna(value) else value for value in row_values
                )
                insert_query = f"INSERT INTO {table_name} (main_id, {', '.join(group_columns)}) VALUES (%s, {', '.join(['%s'] * len(row))})"
                cursor.execute(insert_query, (row.name + 1, *row_values))
            connection.commit()

        print("Inserting data into the main table...")
        for _, row in df.iterrows():
            insert_main_query = f"INSERT INTO {main_table_name} (id) VALUES (%s)"
            cursor.execute(insert_main_query, (row.name + 1,))
            connection.commit()

        create_related_table("group_1", group_1_columns, main_table_name)
        create_related_table("group_2", group_2_columns, main_table_name)

        print(f"Tables created and data inserted successfully.")

except Error as e:
    print(f"Error: {e}")

finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
