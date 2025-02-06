function createClient() {
	const url = `${BASE_URL}/client`;
	const label = document.getElementById("label");
	const name = document.getElementById("name");
	const currency = document.getElementById("currency");
	const password = document.getElementById("password");
	const inputContainer = document.getElementById("to_form");
	const inputs = inputContainer.querySelectorAll("input");
	const data = {};

	inputs.forEach((input) => {
		data[input.id] = input.value;
	});

	const jsonStructure = {
		name: name.value,
		label: label.value,
		data: JSON.stringify(data),
		password: password.value,
		currency: currency.value,
	};

	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
		body: JSON.stringify(jsonStructure),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Error creating client");
			}
			alert("Success");
		})
		.catch((error) => alert("Error"));
}
