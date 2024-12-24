const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path'); // Import path module

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' folder

// Route to serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Adjust the file name if needed
});

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'netkeshiv3521@gmail.com', // Replace with your correct email
        pass: 'ocdq iyun clhl xgyl' // Replace with your generated app password
    }
});

// Route to handle login form submission
app.post('/submit-login', (req, res) => {
    const { username, password } = req.body;  // Retrieve form fields

    // You can add logic to validate username and password here

    // Once the login is successful, redirect to the next page (03-index.html)
    res.redirect('/03-index.html');
});

// Serve 03-index.html after login
app.get('/03-index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '03-index.html'));
});

// Route to handle dog purchase form submission from 04-dogs.html
app.post('/submit-order', (req, res) => {
    const { petName, name, pincode, address, number } = req.body;

    // Log the form data to the console to verify
    console.log(`Name: ${name}, Pincode: ${pincode}, Address: ${address}, Number: ${number}`);

    // Nodemailer: Send an email with the order details
    const mailOptions = {
        from: 'netkeshiv3521@gmail.com',
        to: 'netakeshivam@aca.edu.in', // Replace with the recipient's email
        subject: 'New Pet Order Received',
        text: `New Pet order details:\n\nPet Name: ${petName}\n\nClient Details :\n\nClient Name: ${name}\nPincode: ${pincode}\nAddress: ${address}\nMobile Number: ${number}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error); // Log the error for debugging
            return res.status(500).send('Error occurred while sending email');
        }
        console.log('Email sent: ' + info.response);

        // Adding the "Done" button and a script to clear local storage
        res.status(200).send(`
            
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="./01-index.css">
                    <title>Submit Application - O N S P</title>
                    <style>
                        body{
                            background-color: white; 
                            color: black;
                        }
                        .container{
                            text-align: center;
                            justify-content: center;
                            margin-top: 50px;
                        }
                        button{
                            text-decoration: none;
                            border: 1px solid #007bff;
                            border-radius: 3px;
                            background-color: white;
                            color: #007bff;
                            padding: 6px 40px;
                            
                        }
                        button:hover{
                            color: white;
                            background-color: #007bff;
                            transition: ease-in-out;
                        }
                    </style>
                    </head> 
                    <body>
                    <div class="container">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQbY8UK-BaW-W8oLqpI_Hd2kBMdjW6Q3CKBg&s" alt="">
                    <p>Order application has been successfully submitted. We will review and get back to you soon.</p>
                    <p>Make sure that you done the payment. Otherwise we cant assist you for your order. Thank you!</p>
                    <button onclick="clearLocalStorage()">Go to Home</button>
                    </div>
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
