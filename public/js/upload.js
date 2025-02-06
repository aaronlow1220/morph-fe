function radioChange() {
	const fileRadio = document.getElementById("file-radio");
	const urlRadio = document.getElementById("url-radio");
	const file = document.getElementById("file");
	const url = document.getElementById("url");

	fileRadio.addEventListener("click", () => {
		file.disabled = false;
		url.disabled = true;
		url.value = "";
	});

	urlRadio.addEventListener("click", () => {
		file.disabled = true;
		url.disabled = false;
		file.value = "";
	});
}

function fetchClient() {
	const url = `${BASE_URL}/client/search`;

	const data = {
		pageSize: 50,
	};

	fetch(url, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			const clientList = document.getElementById("client");
			data["_data"].forEach((client) => {
				const option = document.createElement("option");
				option.value = client.id;
				option.text = client.label;
				clientList.appendChild(option);
			});
		})
		.catch((error) => console.error(error));
}

function uploadFile() {
	const client = document.getElementById("client").value;
	const file = document.getElementById("file").files[0];
	const file_url = `${BASE_URL}/file/upload/${client}`;

	const formData = new FormData();
	formData.append("file", file);

	fetch(file_url, {
		method: "POST",
		body: formData,
		headers: {
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error();
			}
			stateModal("success", "成功上傳檔案");
		})
		.catch((error) => stateModal("error", "上傳檔案失敗，請再試一次"));
}

function uploadUrl() {
	const client = document.getElementById("client").value;
	const url = document.getElementById("url").value;
	const file_url = `${BASE_URL}/file/upload/${client}`;

	fetch(file_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
		body: JSON.stringify({ url: url }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error();
			}
			stateModal("success", "成功使用 URL 上傳檔案");
		})
		.catch((error) => stateModal("error", "使用 URL 上傳檔案失敗，請再試一次"));
}

function upload() {
	const fileRadio = document.getElementById("file-radio");
	const urlRadio = document.getElementById("url-radio");

	if (fileRadio.checked) {
		uploadFile();
	} else if (urlRadio.checked) {
		uploadUrl();
	}
}

// Window onload
window.onload = () => {
	radioChange();
	fetchClient();
};
