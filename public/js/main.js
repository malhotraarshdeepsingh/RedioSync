const socket = io();

// const messageInput = document.getElementById("messageInput");
// const messagesList = document.getElementById("messagesList");
// const sendButton = document.getElementById("sendButton");

// sendButton.addEventListener("click", () => {
//   const message = messageInput.value;
//   if (message) {
//     console.log("Sending message:", message);
//     socket.emit("message", message);
//     messageInput.value = "";
//   }
// });

// socket.on("broadcast_message", (msg) => {
//   console.log("Received broadcast:", msg);
//   const messageElement = document.createElement("li");
//   messageElement.textContent = msg;
//   messagesList.appendChild(messageElement);
// });

const checkboxContainer = document.getElementById("checkbox-container");

const checkBoxes = new Array(1000).fill(false);

socket.on("checkbox_change", (data) => {
  // const { index, value } = data;
  // checkBoxes[index] = value;
  // console.log(`Checkbox at index ${index} changed to ${value}`);
  stateUpdate(data.index, data.value);
});

checkBoxes.forEach((checkBoxe, index) => {
  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.id = `${index}`;
  input.addEventListener("change", (event) => {
    socket.emit("checkbox_change", {
      index: index,
      value: input.checked,
    });
  });
  checkboxContainer.appendChild(input);
});

async function stateUpdate(index, value) {
  const response = await fetch("/state", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const state = data.state;

  if (state) {
    state.forEach((e, index) => {
        const el = document.getElementById(`${index}`);
        if (el) {
          el.checked = e;
        }
    })
  }
}

stateUpdate();
