import { breakStatement, switchCase, switchStatement, Statement, ExpressionStatement, CallExpression, MemberExpression, ArrayExpression, StringLiteral, Identifier, ArrowFunctionExpression } from "@babel/types";
import { IDSL, ToString, ToAst } from "typedraft";

/**
 * convert
 * 
 * {
 *   "use match",
 *   ["a","b","c"].map(value => {...})
 * }
 * 
 * to
 * 
 * switch (value) {
 *   case "a": {...} break;
 *   case "b": {...} break;
 *   case "c": {...} break;
 * }
 */
class Match implements IDSL {
    m_Merge: boolean;

    constructor() {
        this.m_Merge = true;
    }

    Transcribe(block: Array<Statement>): Array<Statement> {
        const [use_match, pattern] = block;

        const expression = (pattern as ExpressionStatement).expression;
        const callee = ((expression as CallExpression).callee) as MemberExpression;
        const tests = (callee.object as ArrayExpression).elements.map((each: StringLiteral) => each);
        // console.log(tests); 
        // expected: [ 'CancelSubscribe', 'SetKV', 'DeleteByKey' ]

        const [arrow_expression] = ((expression as CallExpression).arguments) as [ArrowFunctionExpression];
        const [to_match] = arrow_expression.params as [Identifier];
        // console.log(to_match);
        // expected: _type

        // we can manipulate ast to get the same result
        // for brevity, we use string.replace here:
        const case_body = arrow_expression.body;
        const consequents = tests
            .map(test => ToString(case_body).replace(`[${to_match.name}]`, `.${test.value}`))
            .map(str => ToAst(str));

        //
        const switch_statement = switchStatement(
            to_match,
            tests.map((test, index) => switchCase(test, [consequents[index], breakStatement()]))
        );
        return [switch_statement];
    }
}

export default {
    DSLs: [
        {
            name: "match",
            dsl: () => new Match()
        }
    ]
}