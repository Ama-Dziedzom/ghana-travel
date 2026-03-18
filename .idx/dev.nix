{ pkgs, ... }: {
  packages = [
    pkgs.nodejs_20
  ];
  
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = ["npm" "run" "dev"];
        manager = "web";
        port = 3000;
      };
    };
  };
}
