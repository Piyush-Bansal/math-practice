import postcss from 'postcss';

type DependencyGraph = Map<string, Set<string>>;

const VAR_REGEX = /var\(\s*(--[\w-]+)/g;

function buildDependencyGraph(root: postcss.Root): DependencyGraph {
	const graph: DependencyGraph = new Map();

	root.walkDecls((decl) => {
		if (!decl.prop.startsWith('--')) {
			return;
		}

		if (!decl.value.includes('var(')) {
			return;
		}

		let dependencies = graph.get(decl.prop);

		if (!dependencies) {
			dependencies = new Set<string>();
			graph.set(decl.prop, dependencies);
		}

		VAR_REGEX.lastIndex = 0;

		let match: RegExpExecArray | null;

		while ((match = VAR_REGEX.exec(decl.value))) {
			dependencies.add(match[1]);
		}
	});

	return graph;
}

function expandDependencies(
	initial: ReadonlySet<string>,
	graph: ReadonlyMap<string, ReadonlySet<string>>
): Set<string> {
	const reachable = new Set(initial);
	const stack = [...initial];

	while (stack.length > 0) {
		const current = stack.pop()!;

		const dependencies = graph.get(current);

		if (!dependencies) {
			continue;
		}

		for (const dependency of dependencies) {
			if (reachable.has(dependency)) {
				continue;
			}

			reachable.add(dependency);
			stack.push(dependency);
		}
	}

	return reachable;
}

export function buildReachableVariables(
	root: postcss.Root,
	used: ReadonlySet<string>
): Set<string> {
	return expandDependencies(used, buildDependencyGraph(root));
}
