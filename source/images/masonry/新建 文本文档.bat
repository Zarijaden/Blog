@echo off
chcp 65001 >nul
echo Generating masonry.yml...

echo # Masonry gallery configuration > masonry.yml
for %%i in (*.jpg *.png *.jpeg *.webp) do (
  echo - image: /images/masonry/%%i >> masonry.yml
  echo   title: >> masonry.yml
  echo   description: >> masonry.yml
)

echo Done! Check masonry.yml in current directory.
pause