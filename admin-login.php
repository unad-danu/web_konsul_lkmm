<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            padding: 15px;
            background-color: #59d5e0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }

        .card-form-login {
            background: white;
            padding: 35px 25px;
            border-radius: 30px;
            border: 4px solid #2d1b69;
            width: 100%;
            max-width: 450px;
            box-shadow: 12px 12px 0px rgba(0,0,0,0.1);
            text-align: center;
            position: relative;
        }

        /* Tombol Kembali di Dalam Kartu */
        .btn-back-inline {
            display: block;
            text-align: left;
            text-decoration: none;
            color: #2d1b69;
            font-weight: 800;
            margin-bottom: 20px;
            font-size: 16px;
        }

        .card-form-login h2 {
            font-size: clamp(24px, 5vw, 32px);
            font-weight: 800;
            margin-bottom: 25px;
            text-transform: uppercase;
            color: #000;
        }

        .card-form-login input {
            width: 100%;
            padding: clamp(14px, 3vw, 18px);
            margin-bottom: 20px;
            border: 3px solid #2d1b69;
            border-radius: 15px;
            font-weight: 800;
            font-size: 18px;
            box-sizing: border-box;
            outline: none;
            background-color: #fff;
        }

        .btn-login-big {
            background-color: #f400ff;
            color: white;
            border: 4px solid #2d1b69;
            border-radius: 18px;
            padding: clamp(14px, 3vw, 18px);
            width: 100%;
            font-size: clamp(18px, 4vw, 24px);
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0px 8px 0px #2d1b69;
            transition: 0.1s;
            text-transform: uppercase;
        }

        .btn-login-big:active {
            transform: translateY(4px);
            box-shadow: 0px 4px 0px #2d1b69;
        }

        #login-error-msg {
            color: #ff0000;
            margin-top: 15px;
            font-weight: 800;
            font-size: 14px;
            min-height: 20px;
        }
    </style>
</head>
<body>

    <div class="card-form-login">
        <!-- Tombol kembali sekarang di dalam kotak -->
        <a href="index.php" class="btn-back-inline">← KEMBALI</a>

        <h2>Admin Login</h2>
        
        <input type="text" id="login-username" placeholder="Username" autocomplete="off">
        <input type="password" id="login-password" placeholder="Password">
        
        <button type="button" class="btn-login-big" onclick="executeLogin()">MASUK</button>
        
        <p id="login-error-msg"></p>
    </div>

    <script src="app.js"></script>
</body>
</html>