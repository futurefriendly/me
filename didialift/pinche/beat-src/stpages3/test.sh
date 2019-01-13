#!/bin/bash

export FIS_BUILD_STATE="test"

beat release -c
beat release -c -D -d test -o --md5
