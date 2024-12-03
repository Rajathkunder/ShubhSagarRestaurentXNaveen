//Below code is for admin auth
exports.loginHandler = (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt with:", req.body);

  if (email === "admin@gmail.com" && password === "admin") {
    console.log("succes login");

    res.redirect("/admin/dashboard");
  } else {
    res.send(`
        <script>
          alert('Invalid username or password.');
          window.history.back();
        </script>
      `);
  }
};
