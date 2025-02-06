const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Path to the orders.txt file
const ordersFilePath = path.join(__dirname, 'orders.txt');

// Route to serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '01-login.html'));
});

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'netkeshiv3521@gmail.com',
        pass: 'ocdq iyun clhl xgyl'
    }
});

// Route to handle login form submission
app.post('/submit-login', (req, res) => {
    const { username, password } = req.body;
    res.redirect('/03-index.html');
});

// Serve 03-index.html after login
app.get('/03-index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '03-index.html'));
});

// Route to handle pet order form submission
app.post('/submit-order', (req, res) => {
    const { petName, name, pincode, address, number } = req.body;

    // Order details
    const orderDetails = `Pet Name: ${petName}\nClient Name: ${name}\nPincode: ${pincode}\nAddress: ${address}\nMobile Number: ${number}\n\n--------------------------------\n\n`;

    // Append order details to orders.txt
    fs.appendFile(ordersFilePath, orderDetails, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Order saved to orders.txt');
        }
    });

    // Nodemailer: Send an email with the order details
    const mailOptions = {
        from: 'netkeshiv3521@gmail.com',
        to: 'netakeshivam@aca.edu.in',
        subject: 'New Pet Order Received',
        text: `New Pet order details:\n\n${orderDetails}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error occurred while sending email');
        }
        console.log('Email sent: ' + info.response);

        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Submitted</title>
                    <style>
                        body {
                            background-color: white;
                            color: black;
                            text-align: center;
                            margin-top: 50px;
                        }
                        button {
                            text-decoration: none;
                            border: 1px solid #007bff;
                            border-radius: 3px;
                            background-color: white;
                            color: #007bff;
                            padding: 6px 40px;
                        }
                        button:hover {
                            color: white;
                            background-color: #007bff;
                            transition: ease-in-out;
                        }
                    </style>
                </head>
                <body>
                    <p>Order has been successfully submitted. We will review it soon.</p>
                    <p>Make sure you have completed the payment. Thank you!</p>
                    <button onclick="clearLocalStorage()">Go to Home</button>
                    <script>
                        function clearLocalStorage() {
                            localStorage.clear();
                            window.location.href = './03-index.html';
                        }
                    </script>
                </body>
            </html>
        `);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
