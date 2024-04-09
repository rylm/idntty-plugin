const { Client } = require('pg');

// PostgreSQL database connection configuration
const dbConfig = {
	user: 'idntty',
	host: 'localhost',
	database: 'idntty',
	password: 'fsDVdaj36158',
	port: 5432, // usually 5432
};

async function fetchTableFields() {
	const client = new Client(dbConfig);

	try {
		await client.connect();

		const tableName = 'users';

		// Query to fetch column names and data types from information_schema.columns
		const query = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = $1;
    `;

		const result = await client.query(query, [tableName]);

		if (result.rows.length > 0) {
			console.log(`Fields in table '${tableName}':`);
			result.rows.forEach(row => {
				console.log(`${row.column_name}: ${row.data_type}`);
			});
		} else {
			console.log(`No fields found in table '${tableName}'.`);
		}
	} catch (error) {
		console.error('Error fetching table fields:', error);
	} finally {
		await client.end();
	}
}

// Call the function to fetch and display table fields
fetchTableFields();
