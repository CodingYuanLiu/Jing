############################################################
# Dockerfile to build gateway container images
############################################################
# Set the base image to Ubuntu
FROM ubuntu
# Add app to the image
ADD ./main /home/app/bin
# Run APP
ENTRYPOINT [ "/home/app/bin/main" ] 