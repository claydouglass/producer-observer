# Phase 2: Human-in-the-Loop Feedback

**Capture user decisions as learning signals**

---

## 2.1 Persist Simulation Decisions

When users toggle decisions in the Simulate tab:

```javascript
// Current: ephemeral state
const [decisions, setDecisions] = useState({...})

// Target: persist to storage + log as feedback
const toggleDecision = (key) => {
  const newDecisions = {...decisions, [key]: !decisions[key]};
  setDecisions(newDecisions);
  saveFeedback({
    type: 'decision_toggle',
    key,
    value: newDecisions[key],
    timestamp: Date.now(),
    context: { scenario, forecast }
  });
};
```

---

## 2.2 Track User Interactions

Capture signals from normal usage:

| Action | Learning Signal |
|--------|-----------------|
| Filter by Type/Category | Interest patterns |
| Switch scenarios | Risk tolerance |
| Time on tab | Priority areas |
| Return visits | Engagement level |

---

## 2.3 Feedback Storage

Start simple with localStorage, evolve to API:

```javascript
// src/utils/feedback.js
export const saveFeedback = (event) => {
  const history = JSON.parse(
    localStorage.getItem('feedback') || '[]'
  );
  history.push(event);
  localStorage.setItem('feedback', JSON.stringify(history));
};

export const getFeedbackHistory = () => {
  return JSON.parse(localStorage.getItem('feedback') || '[]');
};
```

---

## 2.4 What Accumulates

Over time, the system learns:

- Which decisions users actually commit to
- Which scenarios they prefer (risk appetite)
- Which categories get the most attention
- Patterns in how they explore data

---

## Outcome

After Phase 2:
- User preferences **persist across sessions**
- Decision patterns **inform future defaults**
- System learns **what matters to this user**

---

[← Previous: Phase 1](./06-phase1-structured-memory.md) | [Next: Phase 3 →](./08-phase3-performance-loop.md)
