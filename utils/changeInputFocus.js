export function changeInputFocus() {
    document.querySelectorAll(".input-container").forEach((inputContainer) => {
        inputContainer.onclick = function () {
            this.querySelector("input").focus();
            document
                .querySelector(".input-container.onFocus")
                ?.classList.remove("onFocus");

            this.classList.add("onFocus");
        };
    });
}
