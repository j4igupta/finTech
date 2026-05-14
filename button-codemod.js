export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let hasModifications = false;

  // 1. Find all lowercase <button> or </button> JSX tags
  root.find(j.JSXIdentifier, { name: 'button' }).forEach(path => {
    // Ensure we are only renaming the actual HTML tags, not variables named 'button'
    if (path.parent.node.type === 'JSXOpeningElement' || path.parent.node.type === 'JSXClosingElement') {
      path.node.name = 'Button'; // Capitalize it!
      hasModifications = true;
    }
  });

  // 2. If we changed something, we MUST add the shadcn import at the top of the file
  if (hasModifications) {
    const importStatement = j.importDeclaration(
      [j.importSpecifier(j.identifier('Button'))],
      j.literal('@/components/ui/button')
    );

    // Look for existing imports and place this one right above them
    const imports = root.find(j.ImportDeclaration);
    if (imports.length > 0) {
      // Check if it's already imported so we don't duplicate it
      const alreadyImported = imports.filter(path => path.node.source.value === '@/components/ui/button').length > 0;
      if (!alreadyImported) {
        imports.at(0).insertBefore(importStatement);
      }
    } else {
      // If there are no imports at all, just shove it at the very top of the file
      root.get().node.program.body.unshift(importStatement);
    }
  }

  // 3. Return the newly re-written code back to the file!
  return hasModifications ? root.toSource() : null;
}