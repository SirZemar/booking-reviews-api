# Build and deploy api container to Cloud Run

## Create express app

The app is an API listening to porto 8080 by default. App is declarated in a index.ts file.
tsconfig.json configures compilation to target src folder and to distribuite the compiled code  i a dist folder.
package.json is configure to run the necessary scripts:
  - "build": txc
  - "start": npm run dist/index.js 

## Configure Dockerfile:
  - Uses Node.js 18 as the base image.
     Install Dependencies

  - Updates package lists, installs gnupg and wget.
      Google Chrome Setup:
      Downloads Google Chrome signing key, adds Chrome repository to sources, installs Chrome, and cleans up.

  - Working Directory:
      Sets the working directory to /app.

  - Copy & Install Dependencies:
      Copies package.json and package-lock.json, installs Node.js dependencies.

  - Copy Application Code:
      Copies the application code to the working directory.

  - Environment Variable:
      Sets the environment variable PORT to 8080.

  - Build Application:
      Runs the build script for the Node.js application.

  - Expose Port:
      Documents that the application uses port 8080.

  - Run Command:
      Sets the default command to start the application using npm start.

## Create Artifact Registry in googgle cloud

In google cloud platform navigate to artifact registry service and then press the "+" sign to create a new repository.

### Configurations
- Format: Docker
- Mode: Standard
- Location type: europe-west2
- Encryption: Google-managed encryption key
- Cleanup policy: Dry run

Press create

## Build and push docker image

### Build

docker build -t IMAGE_REPOSITORY:IMAGE_TAG .

```sh
$ docker build -t booking-reviews-api:0.0.1 .
```

### Tag

Tag the new image to gcloud repository image

Usage:  docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE

```sh
$ docker tag bf63a6b83e50  europe-west2-docker.pkg.dev/booking-reviews-api/api/main-image:0.0.1
```

### Auth docker

> É preciso fazer a autenticação nos repositórios sempre que usar o Docker ou outro cliente de terceiros com um repositório do Docker. Esta seção fornece um breve resumo do que você precisará para autenticar com êxito. Para instruções detalhadas, consulte [Como configurar a autenticação do Docker](https://cloud.google.com/artifact-registry/docs/docker/authentication?hl=pt-br). - [*Como autenticar em um repositório*](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling?hl=pt-br#auth)

When logged in on gcloud it is necessary to add credentials to the artifact registry repository.

```sh
$ gcloud auth configure-docker europe-west2-docker.pkg.dev
```
#### If not authenticated:

```sh
Adding credentials for: europe-west2-docker.pkg.dev
After update, the following will be written to your Docker config file located at [/Users/josemarinho/.docker/config.json]:
 {
  "credHelpers": {
    "europe-west2-docker.pkg.dev": "gcloud"
  }
}

Do you want to continue (Y/n)?  y

Docker configuration file updated.
```

#### If already authenticate:

```sh
  WARNING: Your config file at [/Users/josemarinho/.docker/config.json] contains these credential helper entries:

  {
    "credHelpers": {
      "europe-west2-docker.pkg.dev": "gcloud"
    }
  }
  Adding credentials for: europe-west2-docker.pkg.dev
  gcloud credential helpers already registered correctly.


  Updates are available for some Google Cloud CLI components.  To install them,
  please run:
    $ gcloud components update
```

### Push

Now with authorization to push into artifact registry repository, push with command:

docker push LOCATION-REPOSITORY_FORMAT.pkg.dev/PROJECT_ID/REPOSITORY/IMAGE
```sh
$ docker push europe-west2-docker.pkg.dev/booking-reviews-api/api/main-image:0.0.1

The push refers to repository [europe-west2-docker.pkg.dev/booking-reviews-api/api/main-image]
6b3716dcfff1: Pushed 
0115937fd0b1: Pushed 
e91a42a48dd1: Pushed 
099c4d874c5c: Pushed 
b57679bf7a34: Layer already exists 
c77f522e7047: Layer already exists 
f5f444f9402a: Layer already exists 
2508f7581bd2: Layer already exists 
10990993c4dd: Layer already exists 
652b81616682: Layer already exists 
80bd043d4663: Layer already exists 
30f5cd833236: Layer already exists 
7c32e0608151: Layer already exists 
7cea17427f83: Layer already exists 
0.0.1: digest: sha256:3c39fc8a4890e9208b19f1c02a38ef6dd59213c1f6db02f0dec06f059615a20b size: 3267
```

## Deploy 

```sh
$ gcloud run deploy --image europe-west2-docker.pkg.dev/booking-reviews-api/api/main-image:0.0.1

service name (NAME): (press enter)
Please specify a region: 18 (press enter)
 ```
## Sources

- https://www.youtube.com/watch?v=cLOld8de5ZI&ab_channel=TechWithFoyzur
- https://medium.com/@vinhle95/deploy-a-containerised-node-js-application-to-cloud-run-80d2da6b7040