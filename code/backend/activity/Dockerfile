############################################################
# Dockerfile to build activity container images
############################################################
# Set the base image to Ubuntu
FROM ubuntu
# Add app to the image
ADD ./main /home/app/bin
# Run APP
RUN ["apt", "update"]
RUN ["apt", "install", "ca-certificates"]
CMD [ "/home/app/bin" ] 