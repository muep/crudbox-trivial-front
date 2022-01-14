const ct_json = "application/json";

const delete_id = id => {
    return async (ev) => {
        const req = {
            method: "DELETE",
        };

        const res = await fetch(`api/message/${id}`, req);
        if (!res.ok) {
            console.log(res);
            return;
        }
        reload_messages();
    };
};

const main = () => {
    const submit_btn = document.getElementById("submit-msg");
    submit_btn.onclick = submit;

    reload_messages();
};

const reload_messages = async () => {
    const response = await fetch("api/message");
    if (!response.ok) {
        return;
    }

    let messages = await response.json();

    const messages_div = document.getElementById("messages");
    messages_div.innerHTML = "";

    messages.sort((a,b) => b.sent_time - a.sent_time);

    for (const msg of messages) {
        const time = new Date(1000 * msg.sent_time);
        const h = document.createElement("h3");
        h.textContent = `${msg.title}`;

        const p = document.createElement("p");
        p.textContent = msg.content;

        const time_p = document.createElement("p");
        time_p.textContent = "" + time;

        const del = document.createElement("button");
        del.textContent = "delete";
        del.onclick = delete_id(msg.id);

        const message_div = document.createElement("div");
        message_div.appendChild(h);
        message_div.appendChild(p);
        message_div.appendChild(time_p);
        message_div.appendChild(del);

        messages_div.appendChild(message_div);
    }
};

const submit = async (ev) => {
    const title_input = document.getElementById("msg-title");
    const content_input = document.getElementById("msg-content");

    const title = title_input.value;
    const content = content_input.value;

    if (!(title.length > 0) || !(content.length > 0)) {
        return;
    }

    const msg = {
        title , content,
    };

    const req = {
        headers: {
            "Accept": ct_json,
            "Content-Type": ct_json,
        },
        method: "POST",
        body: JSON.stringify(msg),
    };

    const res = await fetch("api/message", req);
    if (!res.ok) {
        console.log(res);
        return;
    }

    title_input.value = "";
    content_input.value = "";
    reload_messages();
};

window.onload = main;
