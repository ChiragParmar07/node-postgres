const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routers = require('./routers');
dotenv.config({ path: '.env' });
const app = express();

app.use(cors());
app.use(express.json());
app.use(routers);

const port = process.env.PORT || 5050;

// Server
app.listen(port, () => {
	console.log(
		`========== Server is running on port ${port}, ${app.get('env')} mode, by ${
			process.env.DEVELOPER_NAME
		} ==========`
	);
});
