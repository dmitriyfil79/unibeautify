import {
  Unibeautify,
  Language,
  Beautifier,
  DependencyOptions,
  DependencyType,
} from "../../src/";

test("should throw Error when dependency type is unknown", () => {
  const unibeautify = new Unibeautify();
  const lang: Language = {
    atomGrammars: [],
    extensions: ["test"],
    name: "TestLang",
    namespace: "test",
    since: "0.1.0",
    sublimeSyntaxes: [],
    vscodeLanguages: [],
  };
  unibeautify.loadLanguage(lang);
  const beautifierResult = "Testing Result";
  const dependency: any = {
    type: "wrong",
  };
  const beautifier: Beautifier = {
    beautify: ({ Promise }) => {
      return Promise.resolve(beautifierResult);
    },
    dependencies: [dependency],
    name: "TestBeautify",
    options: {
      TestLang: false,
    },
  };
  return expect(() => {
    unibeautify.loadBeautifier(beautifier);
  }).toThrowError("");
});

describe("Node", () => {
  test("should throw Error when dependency is not installed", () => {
    const unibeautify = new Unibeautify();
    const lang: Language = {
      atomGrammars: [],
      extensions: ["test"],
      name: "TestLang",
      namespace: "test",
      since: "0.1.0",
      sublimeSyntaxes: [],
      vscodeLanguages: [],
    };
    unibeautify.loadLanguage(lang);

    const beautifierResult = "Testing Result";
    const dependency: DependencyOptions = {
      name: "Fakedep",
      package: "fake",
      type: DependencyType.Node,
    };
    const beautifier: Beautifier = {
      beautify: ({ Promise }) => {
        return Promise.resolve(beautifierResult);
      },
      dependencies: [dependency],
      name: "TestBeautify",
      options: {
        TestLang: false,
      },
    };
    unibeautify.loadBeautifier(beautifier);

    return expect(
      unibeautify.beautify({
        languageName: "TestLang",
        options: {},
        text: "test",
      })
    ).rejects.toThrowError(
      'Dependency "Fakedep" is required and not installed.'
    );
  });
});

describe("Executable", () => {
  test("should throw Error when dependency is not installed", () => {
    const unibeautify = new Unibeautify();
    const lang: Language = {
      atomGrammars: [],
      extensions: ["test"],
      name: "TestLang",
      namespace: "test",
      since: "0.1.0",
      sublimeSyntaxes: [],
      vscodeLanguages: [],
    };
    unibeautify.loadLanguage(lang);

    const beautifierResult = "Testing Result";
    const dependency: DependencyOptions = {
      name: "Fake Program",
      parseVersion: text => "",
      program: "fakeprogram",
      type: DependencyType.Executable,
    };
    const beautifier: Beautifier = {
      beautify: ({ Promise, dependencies }) => {
        dependencies.get("");
        return Promise.resolve(beautifierResult);
      },
      dependencies: [dependency],
      name: "TestBeautify",
      options: {
        TestLang: false,
      },
    };
    unibeautify.loadBeautifier(beautifier);

    return expect(
      unibeautify.beautify({
        languageName: "TestLang",
        options: {},
        text: "test",
      })
    ).rejects.toThrowError(
      'Dependency "Fake Program" is required and not installed.'
    );
  });
});