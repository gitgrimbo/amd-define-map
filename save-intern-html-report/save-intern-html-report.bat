@echo off

setlocal

set CWD=%~dp0
set URL=http://localhost:8080/node_modules/intern/client.html?config=tests/intern
set TIME_TO_WAIT_FOR_PAGE_MS=3000
phantomjs %CWD%phantomjs-save-html.js "%URL%" %TIME_TO_WAIT_FOR_PAGE_MS% > %CWD%..\intern-html-report.html

endlocal