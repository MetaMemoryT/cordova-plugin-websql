# Automated cordova tests.  Installs the correct cordova platform,
# installs the plugin, installs the test app, and then runs it on
# a device or emulator.
#
# usage: .\bin\test.ps1 [windows]

param([string]$platform)

if (! $platform) {
  echo "usage: .\bin\test.sh [windows]"
  exit 1
}

if (! (get-command cordova) ) {
  echo "you need cordova. please install with:"
  echo "npm install -g cordova"
  exit 1
}

pushd test-www
if (!$?) { # run from the bin/ directory
  echo "re-pushing"
  pushd ../test-www
}
try {

  # move everything to a temp folder to avoid infinite recursion errors
  if (test-path ../.plugin) { 
    rm -force -recurse ../.plugin -ErrorAction ignore
  }
  mkdir -ErrorAction ignore  ../.plugin | out-null
  cp -recurse ../src, ../plugin.xml, ../www ../.plugin

  # update the plugin, run the test app
  cordova platform add $platform -- --win
  cordova plugin rm com.msopentech.websql
  cordova plugin add ../.plugin
  
  # eventually full automatic run tests
  # cordova run $platform
} finally {
  popd
}
