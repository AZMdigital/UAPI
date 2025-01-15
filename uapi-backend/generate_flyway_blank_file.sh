#!/bin/bash

# Generate the timestamp
timestamp=$(date +'%Y%m%d%H%M')

#If this a test script
read -p "Is this a test script (Y/N): " MODE

#File sequence
read -p "File Sequence (01, 02, 03 ...): " FILE_SEQUENCE

#File sequence
read -p "File type (DDL / DML): " FILE_TYPE

echo "File Detail Example: UH-11231 : Added new Endpoint for getting details"
# Generate the description or identifier
read -p "Enter File Details : " FILE_DETAILS

FILE_DIR="generic/"
if [ "$MODE" = "Y" -o "$MODE" = "y" ]; then
        FILE_DIR="test_data/"
fi

# Combine the timestamp and description to form the version file name
version_file_name="V3_${timestamp}${FILE_SEQUENCE}__${FILE_TYPE}_${FILE_DETAILS}.sql"

file_path="src/main/resources/db/migration/"$FILE_DIR$version_file_name

touch "$file_path"

echo "Blank file created: $file_path"
