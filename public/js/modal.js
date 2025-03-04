function openModal() {
	document.getElementById("modal").style.display = "flex";
}

function closeModal() {
	document.getElementById("modal").style.display = "none";
}

function stateModal(state = "success", message = "") {
	switch (state) {
		case "success":
			var container = document.createElement("div");
			var submitBtn = document.getElementById("submit-btn");
			container.setAttribute("style", "display: flex; align-items: center; flex-direction: row; gap: 0.5rem;");
			var content = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.5001 8.99998C16.8906 9.3905 16.8906 10.0237 16.5001 10.4142L11.7072 15.2071C11.3167 15.5976 10.6835 15.5976 10.293 15.2071L8.0001 12.9142C7.60957 12.5237 7.60957 11.8905 8.0001 11.5C8.39062 11.1095 9.02379 11.1095 9.41431 11.5L11.0001 13.0858L15.0859 8.99998C15.4764 8.60945 16.1096 8.60945 16.5001 8.99998Z" fill="green"/>
            </svg>
            <p>${message}</p>`;

			container.innerHTML = content;
			submitBtn.innerHTML = "確定";
			submitBtn.setAttribute("onclick", "closeModal()");
			document.getElementById("modal-title").innerHTML = "成功";
			document.getElementById("modal-form").innerHTML = container.outerHTML;
			document.getElementById("modal").style.display = "flex";
			break;
		case "error":
			var container = document.createElement("div");
			var submitBtn = document.getElementById("submit-btn");
			container.setAttribute("style", "display: flex; align-items: center; flex-direction: row; gap: 0.5rem;");
			var content = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.5001 8.99998C16.8906 9.3905 16.8906 10.0237 16.5001 10.4142L11.7072 15.2071C11.3167 15.5976 10.6835 15.5976 10.293 15.2071L8.0001 12.9142C7.60957 12.5237 7.60957 11.8905 8.0001 11.5C8.39062 11.1095 9.02379 11.1095 9.41431 11.5L11.0001 13.0858L15.0859 8.99998C15.4764 8.60945 16.1096 8.60945 16.5001 8.99998Z" fill="red"/>
            </svg>
            <p>${message}</p>`;

			container.innerHTML = content;
			submitBtn.innerHTML = "確定";
			submitBtn.setAttribute("onclick", "closeModal()");
			document.getElementById("modal-title").innerHTML = "失敗";
			document.getElementById("modal-form").innerHTML = container.outerHTML;
			document.getElementById("modal").style.display = "flex";
			break;
		default:
			break;
	}
}
