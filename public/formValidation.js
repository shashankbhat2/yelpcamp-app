(function () {
  "use-strict";

  const forms = document.querySelectorAll(".validated-form");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      function (e) {
        if (!form.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
