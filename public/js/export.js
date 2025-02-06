function fetchClient() {
	const url = `${BASE_URL}/client/search`;
	const data = {
		pageSize: 50,
	};

	fetch(url, {
		method: "POST",
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
			const client = document.getElementById("client");
			data["_data"].forEach((element) => {
				const option = document.createElement("option");
				option.value = element.id;
				option.text = element.label;
				client.appendChild(option);
			});
		})
		.catch((error) => console.error("Error:", error));
}

function fetchPlatform() {
	const url = `${BASE_URL}/platform/search`;
	const data = {
		pageSize: 50,
	};

	fetch(url, {
		method: "POST",
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
			const platform = document.getElementById("platform");
			data["_data"].forEach((element) => {
				const option = document.createElement("option");
				option.value = element.id;
				option.text = element.label;
				platform.appendChild(option);
			});
		})
		.catch((error) => console.error("Error:", error));
}

// Window onload
window.onload = () => {
	fetchClient();
	fetchPlatform();
};
