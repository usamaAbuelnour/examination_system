import { changeInputFocus } from "../utils/changeInputFocus.js";

changeInputFocus();

let email, password;

const login = () => {
    document.getElementById("spinner").style.display = "inline-block";
    document.getElementById("errorMessage").style.display = "none";

    fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDw7cJsQ1a05HJGHXO_rf57OQaTv6oXZE0",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true,
            }),
        }
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if ("error" in data) {
                document
                    .querySelector(".input-container.onFocus")
                    ?.classList.remove("onFocus");

                document.getElementById("spinner").style.display = "none";

                document.getElementById("errorMessage").textContent =
                    data.error.message;
                document.getElementById("errorMessage").style.display =
                    "inline-block";
            } else {
                location.replace("../pages/exam.html");
            }
        })
        .catch((err) => {
            console.log(err);
            document.getElementById("spinner").style.display = "none";

            document.getElementById(
                "errorMessage"
            ).textContent = `oops, check your network!!`;
            document.getElementById("errorMessage").style.display =
                "inline-block";
        });
};

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        email = document.getElementById("email").value.trim();
        password = document.getElementById("password").value;
        login();
    });

window.onclick = function (e) {
    if (
        !e.target.parentElement?.className
            .split(" ")
            .includes("input-container") &&
        !e.target?.className.split(" ").includes("input-container")
    ) {
        document
            .querySelector(".input-container.onFocus")
            ?.classList.remove("onFocus");
    }
};
