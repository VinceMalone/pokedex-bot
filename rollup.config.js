import dsv from "@rollup/plugin-dsv";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import builtins from "builtin-modules";

export default {
  input: "functions/pokedex.js",
  output: {
    file: "dist/pokedex.js",
    format: "es",
  },
  plugins: [dsv(), resolve(), commonjs()],
  external: builtins,
};
