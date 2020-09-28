import type { NodePath } from '@babel/traverse'
import type {
  CallExpression,
  ImportDeclaration,
  VariableDeclaration,
  V8IntrinsicIdentifier,
} from '@babel/types'
export default function BabelPluginMdxBrowser() {
  return {
    visitor: {
      // remove all imports, we will add these to scope manually
      ImportDeclaration(path: NodePath<ImportDeclaration>) {
        path.remove()
      },
      // the `makeShortcode` template is nice for error handling but we
      // don't need it here as we are manually injecting dependencies
      VariableDeclaration(path: NodePath<VariableDeclaration>) {
        // this removes any variable that is set using the `makeShortcode` function
        const declaration = path?.node?.declarations[0]
        const init = declaration?.init as CallExpression | null
        const callee = init?.callee as V8IntrinsicIdentifier
        const name = callee?.name
        if (name === 'makeShortcode') {
          path.remove()
        }
      },
    },
  }
}
