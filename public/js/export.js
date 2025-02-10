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
				return response.json().then((response) => {
					throw new Error(response.message);
				});
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
		.catch((error) => console.error("Error:", error.message));
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
				return response.json().then((response) => {
					throw new Error(response.message);
				});
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
		.catch((error) => console.error("Error:", error.message));
}

function addFilter() {
	const filterContainer = document.getElementById("filter-container");
	const filterCount = filterContainer.childElementCount;
	const filterItems = document.createElement("div");
	filterItems.setAttribute("class", "card-row filter-item");
	filterItems.setAttribute("id", `filter-${filterCount + 1}`);
	const filterTemplate = `
		<div class="form-group">
			<input class="input" id="key-${filterCount + 1}" type="text" placeholder="Key">
		</div>
		<div class="form-group operator">
			<select class="input" id="operator-${filterCount + 1}">
				<option value="in">等於</option>
				<option value="like">包含</option>
			</select>
		</div>
		<div class="form-group">
			<input class="input" id="value-${filterCount + 1}" type="text" placeholder="Value">
		</div>
		<div class="form-group delete-btn">
			<button class="btn" onclick="removeFilter(${filterCount + 1})">刪除</button>
		</div>`;

	filterItems.innerHTML = filterTemplate;

	filterContainer.appendChild(filterItems);
}

function removeFilter(filterId) {
	const filter = document.getElementById(`filter-${filterId}`);
	filter.remove();
}

function concatFilter(control = "or", filterItemClassName, prefix = "") {
	const filterItems = document.getElementsByClassName(filterItemClassName);
	const filterList = [];
	let hasValue = false;

	for (let i = 0; i < filterItems.length; i++) {
		const key = document.getElementById(`${prefix}key-${i + 1}`).value;
		const operator = document.getElementById(`${prefix}operator-${i + 1}`).value;
		const value = document.getElementById(`${prefix}value-${i + 1}`).value;

		if (key && value) {
			hasValue = filterItems.length > 0 ? true : false;
			let filter = {};
			if (operator === "in") {
				filter[key] = {
					[operator]: [value],
				};
			} else {
				filter[key] = {
					[operator]: value,
				};
			}
			filterList.push(filter);
		}
	}

	let result = {
		filter: {},
	};

	if (hasValue) {
		result = {
			filter: {
				[control]: filterList,
			},
		};
	}

	return JSON.stringify(result);
}

function createFeedFile() {
	let requestUrl = `${BASE_URL}/feed-file`;
	const client = document.getElementById("client").value;
	const platform = document.getElementById("platform").value;
	const utm = document.getElementById("utm").value;
	const filter = concatFilter("or", "filter-item", "");

	fetch(requestUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
		body: JSON.stringify({
			client_id: client,
			platform_id: platform,
			utm: utm,
			filter: filter,
		}),
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((response) => {
					throw new Error(response.message);
				});
			}
			return response.json();
		})
		.then((data) => {
			refreshFeedFile(data.id, JSON.parse(data.filter)).then(() => {
				fetchAllFeedFile();
				stateModal("success", "建立 Feed File 成功");
			});
		})
		.catch((error) => stateModal("error", `建立 Feed File 失敗: ${error.message}`));
}

function fetchAllFeedFile(page = 1) {
	const url = `${BASE_URL}/feed-file/search`;
	let sftpAdress = "sftp://aws-services.adgeek.com.tw/home/linedpa/ftp/files";
	const data = {
		expand: "client,platform",
		page: page,
		pageSize: 20,
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
				return response.json().then((response) => {
					throw new Error(response.message);
				});
			}
			return response.json();
		})
		.then((data) => {
			const exportList = document.getElementById("export-list");
			exportList.innerHTML = "";
			data["_data"].forEach((feed) => {
				const tr = document.createElement("tr");
				const tdClient = document.createElement("td");
				const tdPlatform = document.createElement("td");
				const tdFilter = document.createElement("td");
				const tdUtm = document.createElement("td");
				const tdPassword = document.createElement("td");
				const tdSftp = document.createElement("td");
				const tdUrl = document.createElement("td");
				const tdRefresh = document.createElement("td");
				const tdEdit = document.createElement("td");

				tdClient.innerHTML = feed.client.label;
				tdPlatform.innerHTML = feed.platform.label;
				tdFilter.innerHTML = filterParse(JSON.parse(feed.filter));
				tdUtm.innerHTML = feed.utm;
				tdPassword.innerHTML = `<input class="input" type="password" id="password-${feed.id}" placeholder="密碼">`;
				if (feed.sftp == "1") {
					const button = document.createElement("button");
					button.setAttribute("class", "btn");
					button.setAttribute(
						"onclick",
						`addToClipboard('${sftpAdress}/${feed.client.name}_${feed.platform.name}_${feed.id}_feed.csv')`
					);
					button.innerHTML = "複製";
					tdSftp.appendChild(button);
				} else {
					tdSftp.innerHTML = "無";
				}

				if (feed.file_id) {
					const button = document.createElement("button");
					button.setAttribute("class", "btn");
					button.setAttribute("id", `url-${feed.id}`);
					button.setAttribute(
						"onclick",
						`addToClipboard('${BASE_URL}/feed/${feed.client.name}/${feed.id}.csv')`
					);
					button.innerHTML = "複製";
					tdUrl.appendChild(button);
				} else {
					tdUrl.innerHTML = "未生成";
				}
				const refreshBtn = document.createElement("button");
				refreshBtn.setAttribute("class", "btn");
				refreshBtn.onclick = () => {
					refreshFeedFile(feed.id, JSON.parse(feed.filter)).then(() => {
						stateModal("success", "成功生成檔案");
						fetchAllFeedFile();
					});
				};
				refreshBtn.innerHTML = "更新";
				tdRefresh.appendChild(refreshBtn);
				tdEdit.innerHTML = `<button class="btn" onclick="openEditFeedFile('${feed.id}')">編輯</button>`;

				tr.appendChild(tdClient);
				tr.appendChild(tdPlatform);
				tr.appendChild(tdFilter);
				tr.appendChild(tdUtm);
				tr.appendChild(tdPassword);
				tr.appendChild(tdSftp);
				tr.appendChild(tdUrl);
				tr.appendChild(tdRefresh);
				tr.appendChild(tdEdit);

				exportList.appendChild(tr);

				document.getElementById(`password-${feed.id}`).addEventListener("keyup", (event) => {
					document.getElementById(`url-${feed.id}`).onclick = () => {
						addToClipboard(`${BASE_URL}/feed/${feed.client.name}/${feed.id}.csv?pw=${event.target.value}`);
					};
				});
			});
			showPagination(data["_meta"].currentPage, data["_meta"].pageCount);
		})
		.catch((error) => console.error("Error:", error.message));
}

function showPagination(page, totalPage) {
	const pagination = document.getElementById("pagination-pages");
	pagination.innerHTML = "";
	// only show 5 pages at a time
	if (totalPage > 5) {
		if (page > 3 && page < totalPage - 2) {
			for (let i = page - 2; i <= page + 2; i++) {
				const pageItem = document.createElement("p");
				pageItem.setAttribute("class", "page");
				if (i === page) {
					pageItem.setAttribute("class", "page active");
				}
				pageItem.onclick = () => fetchAllFeedFile(i);
				pageItem.innerHTML = i;
				pagination.appendChild(pageItem);
			}
		} else if (page <= 3) {
			for (let i = 1; i <= 5; i++) {
				const pageItem = document.createElement("p");
				pageItem.setAttribute("class", "page");
				if (i === page) {
					pageItem.setAttribute("class", "page active");
				}
				pageItem.onclick = () => fetchAllFeedFile(i);
				pageItem.innerHTML = i;
				pagination.appendChild(pageItem);
			}
		} else {
			for (let i = totalPage - 4; i <= totalPage; i++) {
				const pageItem = document.createElement("p");
				pageItem.setAttribute("class", "page");
				if (i === page) {
					pageItem.setAttribute("class", "page active");
				}
				pageItem.onclick = () => fetchAllFeedFile(i);
				pageItem.innerHTML = i;
				pagination.appendChild(pageItem);
			}
		}
	}
}

function nextPage() {
	const currentPage = document.querySelector(".page.active");
	if (currentPage.nextSibling) {
		currentPage.nextSibling.click();
	}
}

function prevPage() {
	const currentPage = document.querySelector(".page.active");
	if (currentPage.previousSibling) {
		currentPage.previousSibling.click();
	}
}

async function refreshFeedFile(id, customFilter) {
	let url = `${BASE_URL}/datafeed/export/${id}`;
	function jsonToUrl(baseURL, json) {
		const queryString = [];

		function buildQueryString(prefix, obj) {
			if (Array.isArray(obj)) {
				obj.forEach((value) => {
					buildQueryString(`${prefix}[]`, value);
				});
			} else if (typeof obj === "object" && obj !== null) {
				Object.keys(obj).forEach((key) => {
					buildQueryString(`${prefix}[${encodeURIComponent(key)}]`, obj[key]);
				});
			} else {
				queryString.push(`${prefix}=${encodeURIComponent(obj)}`);
			}
		}

		Object.keys(json).forEach((key) => {
			buildQueryString(encodeURIComponent(key), json[key]);
		});

		if (queryString.length === 0) {
			return baseURL;
		}

		return `${baseURL}?${queryString.join("&")}`;
	}

	url = jsonToUrl(url, customFilter);

	await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((response) => {
					throw new Error(response.message);
				});
			}
			stateModal("success", "生成檔案成功");
		})
		.catch((error) => stateModal("error", `生成檔案失敗: ${error.message}`));
}

function addToClipboard(content) {
	navigator.clipboard.writeText(content).then(
		(success) => {
			stateModal("success", "複製成功");
		},
		(error) => {
			stateModal("error", "複製失敗");
		}
	);
}

function openEditFeedFile(id) {
	const url = `${BASE_URL}/feed-file/${id}?expand=client,platform`;

	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((response) => {
					throw new Error(response.message);
				});
			}
			return response.json();
		})
		.then((data) => {
			const modalContainer = document.getElementById("modal-form");
			const modalTitle = document.getElementById("modal-title");

			const editContainer = document.createElement("div");
			editContainer.setAttribute("class", "card-form");
			const firstRow = document.createElement("div");
			const secondRow = document.createElement("div");
			firstRow.setAttribute("class", "card-row");
			firstRow.innerHTML = `
			<div class="form-group">
				<label for="edit-client">客戶</label>
				<input class="input" id="edit-client" value="${data.client.label}" disabled>
			</div>
			<div class="form-group">
				<label for="edit-platform">平台</label>
				<input class="input" id="edit-platform" value="${data.platform.label}" disabled>
			</div>`;
			secondRow.setAttribute("class", "card-row");
			secondRow.innerHTML = `
			<div class="form-group">
				<label for="edit-utm">UTM</label>
				<input type="text" id="edit-utm" class="input" placeholder="UTM" value=${data.utm}>
			</div>`;

			const filterContainer = document.createElement("div");
			const filterTitleContainer = document.createElement("div");

			filterTitleContainer.setAttribute("class", "card-row");
			filterTitleContainer.setAttribute("id", "edit-filter-title");
			filterTitleContainer.innerHTML = `
				<h3>篩選</h3>
				<button class="btn" onclick="addEditFilter()">+ 新增</button>`;

			filterContainer.setAttribute("class", "card-col");
			filterContainer.setAttribute("id", "edit-filter-container");

			editContainer.appendChild(firstRow);
			editContainer.appendChild(secondRow);
			editContainer.appendChild(filterTitleContainer);
			editContainer.appendChild(filterContainer);

			modalContainer.innerHTML = editContainer.outerHTML;

			let filterList = JSON.parse(data.filter);
			filterList = filterList.filter;
			if (filterList.or) {
				filterList.or.forEach((param, index) => {
					const key = Object.keys(param)[0];
					const value = Object.values(param)[0];
					addEditFilter();
					document.getElementById(`edit-key-${index + 1}`).value = key;
					document.getElementById(`edit-operator-${index + 1}`).value = Object.keys(value)[0];
					document.getElementById(`edit-value-${index + 1}`).value = value[Object.keys(value)[0]];
				});
			}

			document.getElementById("submit-btn").setAttribute("onclick", `updateFeedFile(${id})`);

			openModal();
		})
		.catch((error) => console.error("Error:", error.message));
}

function addEditFilter() {
	const filterContainer = document.getElementById("edit-filter-container");
	const filterCount = filterContainer.childElementCount;
	const filterItems = document.createElement("div");
	filterItems.setAttribute("class", "card-row edit-filter-item");
	filterItems.setAttribute("id", `edit-filter-${filterCount + 1}`);
	const filterTemplate = `
		<div class="form-group">
			<input class="input" id="edit-key-${filterCount + 1}" type="text" placeholder="Key">
		</div>
		<div class="form-group operator">
			<select class="input" id="edit-operator-${filterCount + 1}">
				<option value="in">等於</option>
				<option value="like">包含</option>
			</select>
			</div>
		<div class="form-group">
			<input class="input" id="edit-value-${filterCount + 1}" type="text" placeholder="Value">
		</div>`;

	filterItems.innerHTML = filterTemplate;
	filterContainer.appendChild(filterItems);
}

function updateFeedFile(id) {
	const url = `${BASE_URL}/feed-file/${id}`;
	const utm = document.getElementById("edit-utm").value;
	const filter = concatFilter("or", "edit-filter-item", "edit-");

	fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
		body: JSON.stringify({
			utm: utm,
			filter: filter,
		}),
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((response) => {
					throw new Error(response.message);
				});
			}
			return response.json();
		})
		.then((data) => {
			fetchAllFeedFile();
			stateModal("success", "更新 Feed File 成功");
		})
		.catch((error) => stateModal("error", `更新 Feed File 失敗: ${error.message}`));
}

function filterParse(filter) {
	const filterList = filter.filter;
	const filterResult = [];
	if (filterList.or) {
		filterList.or.forEach((param) => {
			const key = Object.keys(param)[0];
			const value = Object.values(param)[0];
			filterResult.push(`${key} ${Object.keys(value)[0]} ${value[Object.keys(value)[0]]}`);
		});
	}
	return filterResult.join(", ");
}

// Window onload
window.onload = () => {
	fetchClient();
	fetchPlatform();
	fetchAllFeedFile();
};
