import { Statement } from "@babel/types";
import { IDSL } from "typedraft";

class Debug implements IDSL {
    m_Merge?: boolean;
    m_Env: string;

    constructor(option: { merge: boolean, env: string }) {
        this.m_Merge = option?.merge;
        this.m_Env = option?.env;
    }

    Transcribe(block: Array<Statement>): Array<Statement> {
        if (this.m_Env === "dev") {
            const [use_dsl, ...rest] = block;
            return rest;
        }
        else if (this.m_Env === "production") {
            return [];
        }

        throw new Error(`invalid env: ${this.m_Env}, please use dev or production`);
    }
}

export default {
    DSLs: [
        {
            name: "debug",
            dsl: () => new Debug({ merge: true, env: process.env.NODE_ENV || "dev" })
        }
    ]
}