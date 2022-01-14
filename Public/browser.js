const server = "http://localhost:3000";

function copyToClipboard(text) {
	navigator.clipboard.writeText(text).catch((err) => {
		console.log(err);
	});
}

function removeCopyButton() {
	const copyButton = document.getElementsByClassName("copy-button")[0];
	if (copyButton) {
		copyButton.remove();
	}
}

function createCopyButton(text) {
	const copyButton = document.createElement("button");
	copyButton.innerText = "Copy link";
	copyButton.className = "copy-button";
	copyButton.addEventListener("click", () => {
		copyToClipboard(text);
	});
	return copyButton;
}

window.onload = () => {
	const button = document.getElementsByTagName("button")[0];
	const span = document.getElementsByTagName("span")[0];

	button.addEventListener("click", async (e) => {
		const URL = document.getElementsByTagName("input")[0].value;

		removeCopyButton();

		// send link to server and get back a shortened link
		const data = { URL };

		const returnedData = await sendLink(data);

		// check if link was valid
		if (returnedData) {
			span.classList.remove("error");
			span.innerText = `${window.location.href}url/${returnedData.hash}`;
			const copyButton = createCopyButton(span.innerText);
			span.after(copyButton);
		} else {
			span.classList.add("error");
			span.innerText = "Invalid link!";
		}
	});
};

async function sendLink(data) {
	return await fetch(`${server}/post_link`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error("Error:", error);
		});
}
