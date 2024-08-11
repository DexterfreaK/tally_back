# Use a lightweight base image with Python installed
FROM python:3.9-slim

# Set working directory
WORKDIR /usr/src/app

# Install pylint or flake8
RUN pip install pylint flake8

# Copy your script (if needed)
COPY . .

# Default command (can be overridden)
CMD ["python", "script.py"]
