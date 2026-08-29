# Docker and ACR

The Docker image packages the existing Playwright framework and Chromium dependencies. Docker is only needed on the build/test agent; it is not required on a developer machine.

## Build and run in Azure DevOps

Docker is not required on a developer machine. The `BuildAndPush` stage builds the
image on an Azure DevOps agent and pushes it to ACR. The `RunTests` stage pulls the
immutable build tag and runs the tests in Docker.

Do not copy `qa.env` or `config.yml` into the image. They are ignored by Docker and should remain secret. In CI, the pipeline injects the variables at container runtime.

## Azure DevOps and ACR

1. Create an Azure DevOps Docker Registry service connection for the Azure Container Registry.
2. Replace `YOUR-ACR-SERVICE-CONNECTION` and `YOUR-REGISTRY.azurecr.io` in `azure-pipelines.yml`.
3. Add `BASE_URL`, `API_LOGIN_URL`, `API_USER_EMAIL`, `API_USER_PASSWORD`, `USER_NAME`, `PASSWORD`, and `DB_ENABLED` as secret pipeline variables or a linked variable group.
4. Run the pipeline. It builds and pushes both the build ID tag and `latest`, then pulls that immutable build tag and runs the tests in Docker.
5. To use your VM, replace `vmImage: ubuntu-latest` in the `RunTests` job with the name of the self-hosted Azure DevOps agent pool. Docker must be installed on that VM; it is the VM's responsibility, not the developer machine's.

`DB_ENABLED` should remain `false` unless the test agent can reach Oracle and the required database variables are also supplied.