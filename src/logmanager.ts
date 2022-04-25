export class LogManager {

    docLog: HTMLElement = document.createElement("div");
    created: boolean = false;

    constructor() {
        this.docLog.id = "docLog";
    }

    log(message: string): void {
        if (!this.created) {
            document.body.appendChild(this.docLog);
            this.created = true;
        }
        this.docLog.innerHTML += message + "<br>";
    }

    reset(): void {
        this.docLog.innerHTML = "";
    }

    message(message: string): void {
        this.reset();
        this.log(message);
    }

}
