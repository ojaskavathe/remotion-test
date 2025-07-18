{
  description = "Node Starter";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        common = [
          pkgs.nodejs_22
          pkgs.pnpm
          pkgs.bun
        ];

        dev =
          if builtins.getEnv "CI" != "true" then [
            pkgs.nodePackages.prettier
          ] else [ ];

        inherit (pkgs.stdenv) isDarwin isLinux;

        allPackages = common ++ dev; # Merge common and dev packages

      in
      {
        devShells = {
          default = pkgs.mkShell {
            packages = with pkgs; allPackages;
            shellHook = ''
              export PATH=bin:$PATH
            '';
          };
        };
      });
}
