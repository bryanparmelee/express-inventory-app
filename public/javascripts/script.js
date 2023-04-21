const burger = document.querySelector(".burger-menu");
const sidebar = document.querySelector(".sidebar");

burger.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});
