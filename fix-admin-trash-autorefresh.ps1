$ErrorActionPreference = "Stop"

Set-Location "D:\projects\my-platform"

$path = "app\admin\trash\page.tsx"

$content = Get-Content -Path $path -Raw -Encoding UTF8

$oldBlock = @'
  useEffect(() => {
    void loadTrash(true);
  }, []);
'@

$newBlock = @'
  useEffect(() => {
    void loadTrash(true);

    const intervalId = window.setInterval(() => {
      void loadTrash(false);
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
'@

if (-not $content.Contains($oldBlock)) {
  throw "기존 useEffect 블록을 찾지 못했습니다. app\admin\trash\page.tsx에서 useEffect 부분을 직접 확인해야 합니다."
}

$content = $content.Replace($oldBlock, $newBlock)

Set-Content -Path $path -Value $content -Encoding UTF8

Write-Host "Done: app\admin\trash\page.tsx auto refresh added."