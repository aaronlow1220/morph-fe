function createPlatform() {
	const url = `${BASE_URL}/platform`;
	const label = document.getElementById("label");
	const name = document.getElementById("name");
	const sftp = document.getElementById("sftp");
	const priceCurrency = document.getElementById("price_currency");
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
		sftp: String(Number(sftp.checked)),
		price_currency: String(Number(priceCurrency.checked)),
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
				return response.json().then((response) => {
					throw new Error(response.message);
				});
			}
			stateModal("success", "成功新增平台");
		})
		.catch((error) => stateModal("error", `新增平台失敗: ${error.message}`));
}
