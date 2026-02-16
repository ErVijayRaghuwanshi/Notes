# ------------------------------------------------
# Project Variables
# ------------------------------------------------
APP_NAME         := TargetAnomaly
VERSION          := $(strip $(file < version))
RELEASE_FILE     := $(APP_NAME)_v$(VERSION).tar.gz
BACKUP_FILE      := $(APP_NAME)_v$(VERSION)_src_bkp.tar.gz

# Directories
SRC              := src
DIST_DIR         := dist
BUILD_DIR        := build
RELEASE_DIR      := release
VENV             := .venv
BACKUP           := backup

# Executable Names
TASK_SUBMITTER   := TargetAnomalyTaskSubmitter
TASK_PROCESSOR   := TargetAnomalyTaskProcessor

# Files
REQUIREMENTS     := $(SRC)/requirements.txt
SUBMITTER_SRC    := $(SRC)/$(TASK_SUBMITTER).py
PROCESSOR_SRC    := $(SRC)/$(TASK_PROCESSOR).py
SUBMITTER_JSON   := $(SRC)/request_for_submitter.json
PROCESSOR_JSON   := $(SRC)/input_json_for_processor.json

# uv Binaries
UV               := uv
PYTHON           := $(VENV)/bin/python
PYINSTALLER      := $(VENV)/bin/pyinstaller

.PHONY: help install build package deploy run_submitter run_processor clean

help:
	@echo "Makefile targets (using uv):"
	@echo "  install       - setup venv and install dependencies via uv"
	@echo "  build         - build one-file binaries via PyInstaller"
	@echo "  package       - create $(RELEASE_DIR)/$(RELEASE_FILE)"
	@echo "  deploy        - scp package to DEPLOY_HOST"
	@echo "  clean         - remove build artifacts and specs"

$(VENV):
	@echo "Creating virtualenv with uv..."
	@$(UV) venv $(VENV)

install: $(VENV)
	@echo "Installing dependencies..."
	@$(UV) pip install -r $(REQUIREMENTS)
	@$(UV) pip install pyinstaller

build: install
	@echo "Building binaries..."
	@mkdir -p $(DIST_DIR) $(BUILD_DIR)
	@$(UV) run pyinstaller --onefile --distpath $(DIST_DIR) --workpath $(BUILD_DIR) --name $(TASK_PROCESSOR) $(PROCESSOR_SRC)
	@$(UV) run pyinstaller --onefile --distpath $(DIST_DIR) --workpath $(BUILD_DIR) --name $(TASK_SUBMITTER) $(SUBMITTER_SRC)

package: build
	@mkdir -p $(RELEASE_DIR)
	@tar -C $(DIST_DIR) -czf $(RELEASE_DIR)/$(RELEASE_FILE) $(TASK_PROCESSOR) $(TASK_SUBMITTER)
	@echo "Packaged: $(RELEASE_DIR)/$(RELEASE_FILE)"

deploy: package
	@if [ -z "$(DEPLOY_HOST)" ]; then \
		echo "Error: DEPLOY_HOST is not set. Usage: make deploy DEPLOY_HOST=x.x.x.x"; \
	else \
		DEPLOY_USER=$${DEPLOY_USER:-$(USER)}; \
		DEPLOY_PATH=$${DEPLOY_PATH:-/tmp}; \
		scp $(RELEASE_DIR)/$(RELEASE_FILE) $$DEPLOY_USER@$(DEPLOY_HOST):$$DEPLOY_PATH; \
		echo "Deployed to $$DEPLOY_USER@$(DEPLOY_HOST):$$DEPLOY_PATH"; \
	fi

run_submitter:
	@$(UV) run python $(SUBMITTER_SRC) $(SUBMITTER_JSON)

run_processor:
	@$(UV) run python $(PROCESSOR_SRC) $(PROCESSOR_JSON)

src_bkp:
    # FIXME here I am trying to create backup of source code
	@mkdir -p $(BACKUP)
	@tar -C $(SRC) -czf $(BACKUP)/$(BACKUP_FILE) .

	@echo "Backup created: $(BACKUP)/$(BACKUP_FILE)"
	@ls -alh $(BACKUP)

clean:
	rm -rf $(BUILD_DIR) $(DIST_DIR) $(RELEASE_DIR)
	rm -f *.spec $(SRC)/*.spec
	find . -type d -name "__pycache__" -exec rm -rf {} +
	@echo "Cleaned build artifacts"
