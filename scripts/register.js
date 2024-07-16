import { changeInputFocus } from "../utils/changeInputFocus.js";

changeInputFocus();
sessionStorage.clear()


let isRegisterClicked = false;

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
const validateName = (name) => {
    const re = /^[a-zA-Z]+$/;
    return re.test(name);
};
const validatePassword = (password) => {
    const re = /[a-zA-Z0-9^/s]{5,20}/;
    return re.test(password);
};

export const validateForm = () => {
    let errorMessages = [];
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let passwordConfirm = document.getElementById("passwordConfirm").value;

    if (firstName === "" || !validateName(firstName)) {
        errorMessages.push("invalid");
    } else errorMessages.push(null);

    if (lastName === "" || !validateName(lastName)) {
        errorMessages.push("invalid");
    } else errorMessages.push(null);

    if (email === "" || !validateEmail(email)) {
        errorMessages.push("invalid");
    } else errorMessages.push(null);

    if (password === "" || !validatePassword(password)) {
        errorMessages.push("invalid");
    } else errorMessages.push(null);

    if (passwordConfirm === "" || password !== passwordConfirm) {
        errorMessages.push("invalid");
    } else errorMessages.push(null);

    document.querySelectorAll(".input-container").forEach((input) => {
        input.classList.remove("error");
    });

    return errorMessages;
};

const register = () => {
    document.getElementById("spinner").style.display = "inline-block";
    document.getElementById("errorMessage").style.display = "none";
    fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDw7cJsQ1a05HJGHXO_rf57OQaTv6oXZE0",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                returnSecureToken: true,
            }),
        }
    )
        .then((response) => response.json())
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
            document.getElementById("spinner").style.display = "none";

            document.getElementById(
                "errorMessage"
            ).textContent = `oops, check your network!!`;
            document.getElementById("errorMessage").style.display =
                "inline-block";
        });
};

document
    .getElementById("registrationForm")
    .addEventListener("submit", function (event) {
        isRegisterClicked = true;
        event.preventDefault(); // Prevent form submission

        let errorMessages = validateForm();

        if (errorMessages.filter(Boolean).length) {
            errorMessages.forEach((message, idx) => {
                document
                    .querySelectorAll(".input-container")
                    [idx].classList.remove("onFocus");

                if (message)
                    document
                        .querySelectorAll(".input-container")
                        [idx].classList.add("error");
                else {
                    document
                        .querySelectorAll(".input-container")
                        [idx].classList.remove("error");
                }
            });
        } else {
            // Here you can proceed with form submission, e.g., send data to the server

            register();
        }
    });

window.onclick = function (e) {
    if (
        !e.target.parentElement?.className
            .split(" ")
            .includes("input-container") &&
        !e.target?.className.split(" ").includes("input-container")
    ) {
        let errorMessages = validateForm();
        if (errorMessages.filter(Boolean).length && isRegisterClicked) {
            errorMessages.forEach((message, idx) => {
                document
                    .querySelectorAll(".input-container")
                    [idx].classList.remove("onFocus");

                if (message)
                    document
                        .querySelectorAll(".input-container")
                        [idx].classList.add("error");
                else {
                    document
                        .querySelectorAll(".input-container")
                        [idx].classList.remove("error");
                }
            });
        }
        document
            .querySelector(".input-container.onFocus")
            ?.classList.remove("onFocus");
    }
};
