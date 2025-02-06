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

function addFilter() {
    const filterContainer = document.getElementById("filter-container");
    const filterCount = filterContainer.childElementCount;
    const filterTemplate = `
    <div class="card-row" id="filter-${filterCount + 1}">
        <div class="form-group">
            <input class="input" id="key-${filterCount + 1}" type="text" placeholder="Key">
        </div>
        <div class="form-group operator">
            <select class="input" id="operator-${filterCount + 1}">
                <option value="in">等於</option>
            </select>
        </div>
        <div class="form-group">
            <input class="input" id="value-${filterCount + 1}" type="text" placeholder="Value">
        </div>
        <div class="form-group delete-btn">
            <button class="btn" onclick="removeFilter(${filterCount + 1})">刪除</button>
        </div>
    </div>`;

    filterContainer.innerHTML += filterTemplate;

}

function removeFilter(filterId) {
    const filter = document.getElementById(`filter-${filterId}`);
    filter.remove();

}

// Window onload
window.onload = () => {
	fetchClient();
	fetchPlatform();
};
