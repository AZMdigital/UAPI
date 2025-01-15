// cSpell:ignore unist eqeqeq linebreak iife builtins freelist camelcase multilines setstate
const logicalOperators = ["OR", "AND", "NOT"];
const excludedVariables = ["__typename", "_all", "_count"];
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  globals: {
    React: true,
    google: true,
    JSX: true,
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "simple-import-sort",
    "import",
    // "i18next",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: ["./tsconfig.json"],
      },
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsonc/recommended-with-jsonc",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
    "prettier",
    // "plugin:storybook/recommended",
  ],
  overrides: [
    {
      files: ["*.json", "*.json5", "*.jsonc"],
      parser: "jsonc-eslint-parser",
      rules: {
        // Naming Convention
        "jsonc/key-name-casing": [
          "error",
          {
            camelCase: true,
            PascalCase: false,
            SCREAMING_SNAKE_CASE: false,
            "kebab-case": false,
            snake_case: false,
            ignores: [],
          },
        ],
        "jsonc/sort-keys": [
          "error",
          "asc",
          {
            caseSensitive: true,
            natural: false,
            minKeys: 2,
          },
        ],
      },
    },
    {
      // Turn off rules on package.json file
      files: ["package.json"],
      parser: "jsonc-eslint-parser",
      rules: {
        "jsonc/key-name-casing": "off",
        "jsonc/sort-keys": ["off"],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      rules: {
        // TODO: move these to higher level and only includes here the rules to override which are specific to TS
        // Javascript and typescript
        // Arrays

        /* conflicts with Prettier */
        // "array-element-newline": [2, { "ArrayExpression": "consistent" }],
        // Blocks

        /* conflicts with Prettier */
        "brace-style": 0,

        /* conflicts with Prettier */
        // "@typescript-eslint/brace-style": [
        //   2,
        //   "1tbs",
        //   { "allowSingleLine": true }
        // ],
        // Classes
        "no-dupe-class-members": 0,
        "@typescript-eslint/no-dupe-class-members": 2,
        // Commas & Semicolons

        /* conflicts with Prettier */
        // "semi": 2,
        // "comma-style": 2,
        // "comma-dangle": 0,
        // "@typescript-eslint/comma-dangle": [2, "always"],
        // Comments
        "spaced-comment": 2,
        // Comparison Operators & Equality
        eqeqeq: 1,

        /* conflicts with Prettier */
        // "no-mixed-operators": 1,
        yoda: 2,
        // Conditional Statements
        "no-nested-ternary": 1,
        "no-unneeded-ternary": 2,

        /* conflicts with Prettier */
        // "operator-linebreak": 2,
        "no-sequences": 2,
        // Destructuring
        "prefer-destructuring": 2,
        // Functions
        "func-style": 1,
        "no-loop-func": 0,
        "@typescript-eslint/no-loop-func": 2,
        "no-param-reassign": [
          2,
          {
            props: true,
          },
        ],
        "no-dupe-args": 2,
        // "prefer-arrow-callback": 1,
        // "arrow-body-style": [2, "as-needed"],
        "array-callback-return": 2,
        "no-confusing-arrow": [
          "error",
          {
            allowParens: false,
          },
        ],

        /* conflicts with Prettier */
        // "wrap-iife": 2,
        // "arrow-spacing": 2,
        // "arrow-parens": [2, "as-needed", { "requireForBlockBody": true }],
        // "implicit-arrow-linebreak": 2,
        // "rest-spread-spacing": 2,
        "no-extra-bind": 2,
        // Miscellaneous
        "no-eval": 2,
        "no-new-func": 2,
        "no-implied-eval": 0,
        "@typescript-eslint/no-implied-eval": 2,
        // Modules
        "no-duplicate-imports": 0,
        "@typescript-eslint/no-duplicate-imports": 2,
        "import/no-mutable-exports": 2,
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              // Packages. `react` related packages come first, then `mui` and `next`. Lastly other packages
              ["^react", "^@mui", "^next", "^@?\\w"], // Node.js builtins. You could also generate this regex if you use a `.js` config.
              // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
              [
                "^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)",
              ], // Internal packages
              ["^(~/config)(/.*|$)"],
              ["^(~/utils)(/.*|$)"],
              ["^(~/labels|~/locales)(/.*|$)"],
              ["^(~/state|~/store)(/.*|$)"],
              ["^(~/gql|~/rest|~/api)(/.*|$)"],
              ["^(~/styles)(/.*|$)"],
              ["^(~/modules)(/.*|$)"],
              ["^(~/pages)(/.*|$)"],
              ["^(~/public)(/.*|$)"],
              ["^(~)(/.*|$)"], // Parent imports. Put `..` last.
              ["^\\.\\.(?!/?$)", "^\\.\\./?$"], // Other relative imports. Put same-folder imports and `.` last.
              ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // Side effect imports.
              ["^\\u0000"], // Style imports.
              ["^.+\\.s?css$"],
            ],
          },
        ],
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        // turn on errors for missing imports
        "import/no-unresolved": "error",
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [".*"],
                message:
                  "Relative imports are not allowed. Please use absolute imports",
              },
              {
                group: ["**/index"],
                message:
                  "No need to add index file to the import. It is implicitly imported from it",
              },
            ],
            paths: [
              {
                name: "react",
                importNames: ["React", "default"],
                message: "Don't import React. Use named imports instead.",
              },
            ],
          },
        ],
        // Naming Conventions
        "id-length": [
          2,
          {
            min: 3,
            properties: "always",
            exceptions: [
              "en",
              "ar",
              "sx",
              "id",
              "is",
              "in",
              "no",
              "at",
              "on",
              "up",
              "as",
              "if",
              "my",
              "me",
              "by",
              "of",
              "or",
              "to",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "xs",
              "sm",
              "md",
            ],
          },
        ],

        /* disabled as it conflicts with @typescript-eslint/naming-convention rule */
        // camelcase: 2,
        "new-cap": 2,
        "@typescript-eslint/naming-convention": [
          "error", // {
          //   selector: "default",
          //   format: ["camelCase"],
          //   leadingUnderscore: "allow",
          //   filter: {
          //     regex: [...logicalOperators, ...excludedVariables].join("|"),
          //     match: false,
          //   },
          // },
          // Enforce that Enums are in PascalCase
          {
            selector: ["enum"],
            format: ["PascalCase"],
          }, // Enforce that Enums are either in PascalCase, camelCase or snake_case. Those are usually depends on the backend if GraphQL is used
          {
            selector: ["enumMember"],
            format: ["UPPER_CASE"],
            // leadingUnderscore: "allow",
            filter: {
              regex: [...logicalOperators, ...excludedVariables].join("|"),
              match: false,
            },
          }, // Enforce that all named function declaration or named function expression  are either in camelCase or PascalCase
          {
            selector: "function",
            format: ["PascalCase", "strictCamelCase"],
          }, // Enforce that all named function declaration or named function expression  are either in camelCase or PascalCase
          {
            selector: ["variable"],
            types: ["function"],
            modifiers: ["const"],
            format: ["PascalCase", "strictCamelCase"],
          }, // Enforce that all function expressions other than const are in camelCase
          {
            selector: ["variable"],
            types: ["function"],
            format: ["strictCamelCase"],
          }, // Enforce that all constant string and number variables are in camelCase or UPPER_CASE
          {
            selector: ["variable"],
            types: ["string", "number", "array"],
            modifiers: ["const"],
            format: ["strictCamelCase", "UPPER_CASE"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid",
          }, // Enforce that all other string and number variables are in camelCase
          {
            selector: ["variable"],
            types: ["string", "number"],
            format: ["strictCamelCase"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid",
          }, // Enforce that all array variables are in camelCase
          {
            selector: ["variable"],
            types: ["array"],
            format: ["strictCamelCase"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid",
          }, // Enforce that boolean variables are prefixed with an allowed verb
          {
            selector: "variable",
            types: ["boolean"],
            format: ["PascalCase"],
            prefix: ["is", "should", "has", "can", "did", "will"],
          }, // Ignore destructured names
          {
            selector: "variable",
            modifiers: ["destructured"],
            format: null,
          }, // Enforce that interface names do not begin with an I
          {
            selector: "interface",
            format: ["PascalCase"],
            custom: {
              regex: "^I[A-Z]",
              match: false,
            },
          },
          {
            selector: "parameter",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid",
          },
          {
            selector: "memberLike",
            modifiers: ["private"],
            format: ["camelCase"],
            leadingUnderscore: "require",
            trailingUnderscore: "forbid",
          }, // Enforce that Type properties are in PascalCase
          {
            selector: "typeProperty",
            format: ["PascalCase", "camelCase"],
            filter: {
              regex: [...logicalOperators, ...excludedVariables].join("|"),
              match: false,
            },
          }, // Enforce that classes are in PascalCase
          {
            selector: "class",
            format: ["PascalCase"],
          }, // Enforce that Types ALiases are in PascalCase
          {
            selector: "typeAlias",
            format: ["PascalCase"],
          },
          {
            selector: "property",
            format: ["PascalCase"],
            filter: {
              regex: "[&-]",
              match: false,
            },
          },
          {
            selector: "objectLiteralProperty",
            format: ["camelCase"],
            filter: {
              regex: "[&]|(^aria-)|(^Mui)|(^Em)",
              match: false,
            },
          },
        ],
        "react/forbid-component-props": [
          2,
          {
            forbid: [
              {
                propName: "p",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI padding shorthand is not allowed. Use 'padding' prop instead",
              },
              {
                propName: "pl",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI padding left shorthand is not allowed. Use 'paddingLeft' prop instead",
              },
              {
                propName: "pr",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI padding right shorthand is not allowed. Use 'paddingRight' prop instead",
              },
              {
                propName: "pt",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI padding top shorthand is not allowed. Use 'paddingTop' prop instead",
              },
              {
                propName: "pb",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI padding bottom shorthand is not allowed. Use 'paddingBottom' prop instead",
              },
              {
                propName: "px",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI horizontal padding shorthand is not allowed. Use 'paddingX' prop instead",
              },
              {
                propName: "py",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI vertical padding shorthand is not allowed. Use 'paddingY' prop instead",
              },
              {
                propName: "m",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI margin shorthand is not allowed. Use 'margin' prop instead",
              },
              {
                propName: "ml",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI margin left shorthand is not allowed. Use 'marginLeft' prop instead",
              },
              {
                propName: "mr",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI margin right shorthand is not allowed. Use 'marginRight' prop instead",
              },
              {
                propName: "mt",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI margin top shorthand is not allowed. Use 'marginTop' prop instead",
              },
              {
                propName: "mb",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI margin bottom shorthand is not allowed. Use 'marginBottom' prop instead",
              },
              {
                propName: "mx",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI horizontal margin shorthand is not allowed. Use 'marginX' prop instead",
              },
              {
                propName: "my",
                // "allowedFor": [SomeComponent, AnotherComponent],
                message:
                  "MUI vertical margin shorthand is not allowed. Use 'marginY' prop instead",
              },
            ],
          },
        ],
        // Objects
        "no-new-object": 2,

        /* conflicts with Prettier */
        // "quote-props": [2, "as-needed"],
        "object-shorthand": 2,
        "prefer-object-spread": 1,
        "dot-notation": 0,
        "@typescript-eslint/dot-notation": 2,
        "no-dupe-keys": 2,
        "no-useless-computed-key": 2,
        "no-extend-native": 2,

        /* conflicts with Prettier */
        // "object-property-newline": [
        //   2,
        //   { "allowAllPropertiesOnSameLine": true }
        // ],
        // "object-curly-newline": [2, { "multiline": true }],
        // Return
        "no-unreachable": 2,
        // Strings & Numbers
        // "quotes": 0,
        // "@typescript-eslint/quotes": 2,
        "no-multi-str": 2,
        "prefer-template": 2,
        "no-template-curly-in-string": 2,

        /* conflicts with Prettier */
        // "template-curly-spacing": 2,
        // "no-floating-decimal": 2,
        "no-magic-numbers": 0,
        "@typescript-eslint/no-magic-numbers": [
          1,
          {
            ignore: [0, 1],
          },
        ],
        // Type Casting & Coercion
        "no-new-wrappers": 2,
        radix: 2,
        // Variables
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": [
          2,
          {
            argsIgnorePattern: "^_",
          },
        ],
        "no-undef": 2,
        "one-var": [
          2,
          {
            separateRequires: true,
          },
        ],
        "no-const-assign": 2,
        "no-redeclare": 0,
        "@typescript-eslint/no-redeclare": 2,
        "no-multi-assign": 2,
        "no-self-compare": 2,
        // Whitespace

        /* conflicts with Prettier */
        // "no-tabs": [2],
        // "indent": 0,
        // "@typescript-eslint/indent": [2, 2],
        // "space-before-blocks": 2,
        // "space-before-function-paren": 0,
        // "@typescript-eslint/space-before-function-paren": 2,

        /* conflicts with Prettier */
        // "keyword-spacing": 0,
        // "@typescript-eslint/keyword-spacing": 2,
        // "function-paren-newline": 2,
        // "space-infix-ops": 0,
        // "@typescript-eslint/space-infix-ops": 2,
        // "space-unary-ops": 2,

        /* conflicts with Prettier */
        // "newline-per-chained-call": 2,
        // "no-whitespace-before-property": 2,
        // "dot-location": [2, "property"],
        // "padded-blocks": [2, "never"],
        // "no-multiple-empty-lines": [1, { "max": 1 }],
        // "space-in-parens": 2,

        /* conflicts with Prettier */
        // "array-bracket-spacing": 2,

        /* conflicts with Prettier */
        // "object-curly-spacing": 0,
        // "@typescript-eslint/object-curly-spacing": [2, "always"],

        /* conflicts with Prettier */
        // "max-len": [2, { "ignoreRegExpLiterals": true, "ignoreStrings": true }],

        /* conflicts with Prettier */
        // "block-spacing": 2,
        // "comma-spacing": 0,
        // "@typescript-eslint/comma-spacing": 2,

        /* conflicts with Prettier */
        // "computed-property-spacing": 2,

        /* conflicts with Prettier */
        // "func-call-spacing": 0,
        // "@typescript-eslint/func-call-spacing": 2,

        /* conflicts with Prettier */
        // "key-spacing": 2,

        /* conflicts with Prettier */
        // "no-trailing-spaces": 2,

        /* conflicts with Prettier */
        // "no-multi-spaces": 2,
        // React Conventions
        // We turn off prop-types rule, as we will use TypeScript"s types instead.
        "react/prop-types": 0,
        "react/react-in-jsx-scope": 0,
        // Hooks
        "react-hooks/rules-of-hooks": 2,
        "react-hooks/exhaustive-deps": 2,
        // Methods
        "react/jsx-no-bind": [
          2,
          {
            allowArrowFunctions: true,
          },
        ],
        // Miscellaneous (JSX)
        "react/self-closing-comp": 2,
        // "react/jsx-wrap-multilines": 2,

        /* conflicts with Prettier */
        // "react/jsx-closing-bracket-location": 2,

        /* conflicts with Prettier */
        // "jsx-quotes": 2,
        "react/sort-comp": 2,
        // "si18next/no-literal-string": 2,
        // Naming Conventions (JSX)
        "react/jsx-pascal-case": 2,
        // Organization
        "react/no-multi-comp": 1,
        "react/jsx-filename-extension": [
          2,
          {
            extensions: [".jsx", ".tsx"],
          },
        ],
        // Props
        "react/jsx-boolean-value": 2,
        "react/jsx-curly-brace-presence": 2,
        "jsx-a11y/alt-text": 2,
        "react/no-array-index-key": 2,

        /* conflicts with Prettier */
        // "react/jsx-max-props-per-line": [2, { "maximum": 3 }],
        "jsx-a11y/img-redundant-alt": 2,
        "jsx-a11y/aria-role": 2,
        "jsx-a11y/no-access-key": 2,

        /*  "react/require-default-props": 2, */
        "react/destructuring-assignment": 2,

        /* conflicts with Prettier */
        // "react/jsx-curly-newline": 2,
        // State
        "react/no-access-state-in-setstate": 2,
        "react/no-did-update-set-state": 2,
        "react/no-did-mount-set-state": 2,
        "react/no-direct-mutation-state": 2, // Whitespace (JSX)
        // "react/jsx-closing-tag-location": 2

        /* conflicts with Prettier */
        // "react/jsx-tag-spacing": 2,
        // "react/jsx-indent": [2, 2],
        // "react/jsx-indent-props": [2, 2],

        /* conflicts with Prettier */
        // "react/jsx-curly-spacing": 2,
        // "react/jsx-equals-spacing": 2
      },
    },
  ],
};
