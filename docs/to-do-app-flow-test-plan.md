# To-Do App: Key User Flows and Test Cases

## 1) Top user flows (Google Sheets-ready)

Use a new Google Sheet with these columns:

- Flow ID
- Flow Name
- User Goal
- Steps
- Expected Result
- Priority

| Flow ID | Flow Name | User Goal | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| F1 | Add first task | Create a new task | Enter a valid task name and click Add Task | New task appears in the list and the task counter updates | P0 |
| F2 | Add multiple tasks | Manage several tasks at once | Add 3–5 tasks with different names | All tasks appear in the list in the expected order and count matches number of tasks | P0 |
| F3 | Mark task complete | Track finished work | Add a task, then check the checkbox | Task shows completed styling and remains saved | P0 |
| F4 | Edit existing task | Fix a task name or update wording | Click Edit on a task, change the value, and save | Task text updates correctly and the form returns to Add mode | P0 |
| F5 | Delete a task | Remove tasks no longer needed | Click Delete on an existing task | Task is removed immediately and counter updates | P0 |
| F6 | Delete last task | Handle empty state | Delete the final remaining task | Empty-state message is shown and count reads 0 tasks | P0 |
| F7 | Block empty task submission | Prevent bad input | Leave the input empty and submit | Nothing is added; input remains focused | P1 |
| F8 | Persist after refresh | Keep data for returning users | Add tasks, refresh the page | Tasks remain visible after reload | P0 |
| F9 | Edit then cancel flow | Continue working without error | Start editing, then save a changed value | The updated task remains correct and the form resets | P1 |
| F10 | Count accuracy | Trust task summary | Add, complete, edit, and delete tasks | Task count always matches current visible tasks | P0 |

## 2) Test cases

### Test case matrix

| TC ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-01 | Add valid task | Open app. Type "Buy groceries" in the input. Click Add Task. | Task appears in the list, count updates to 1 task, input clears. |
| TC-02 | Add empty task | Leave input blank. Click Add Task. | No task is created; input stays active; no error message is required. |
| TC-03 | Add multiple tasks | Add "Write report", "Pay bills", "Call mom". | Three tasks appear, all visible, count shows 3 tasks. |
| TC-04 | Toggle completion | Add a task. Click checkbox. | Task is visually marked completed; state persists after refresh. |
| TC-05 | Uncheck completion | Mark a task complete, then click checkbox again. | Task becomes active again and completed styling is removed. |
| TC-06 | Edit task | Add "Read book". Click Edit. Change value to "Read Python book". Click Save Task. | The task text changes to "Read Python book" and the form resets to Add Task. |
| TC-07 | Edit with blank value | Start editing a task. Clear the input and submit. | The change is rejected; task text remains unchanged; input stays active. |
| TC-08 | Delete one task | Add two tasks. Delete the first one. | Only the selected task is removed while the other remains. |
| TC-09 | Delete last task | Delete the only remaining task. | Empty-state message appears: "No tasks yet. Add one above!" and count shows 0 tasks. |
| TC-10 | Persistence after refresh | Add 2 tasks. Refresh the page. | Both tasks still appear after reload. |
| TC-11 | Counter accuracy after add/delete | Add a task, then delete it, then add another task. | Counter matches exactly the number of tasks displayed. |
| TC-12 | Save flow after edit | Add a task, click Edit, update text, submit, then refresh. | The new text persists correctly after refresh. |

## 3) Suggested execution order

1. Smoke tests: TC-01, TC-02, TC-08, TC-09
2. Core CRUD tests: TC-03, TC-06, TC-07, TC-08, TC-12
3. Persistence and reliability: TC-04, TC-05, TC-10, TC-11

## 4) Acceptance criteria summary

- User can create a task using a valid text value.
- User can edit a task without breaking list order or data.
- User can delete a task and the count updates correctly.
- Empty state is shown when no tasks remain.
- Completed state and saved data remain consistent after reload.
- Invalid blank submissions are prevented.
