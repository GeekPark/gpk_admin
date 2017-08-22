#! /bin/bash
ssh -t www "pwd && cd gpk_admin_test/gpk_admin && git pull origin develop && yarn && npm run build"
