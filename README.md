# Autoflow
An experimental tool for rapid prototyping of computer vision workflows using LLMs

[Demo](https://autoflow-sberan.vercel.app)

### Why Autoflow
It is difficult to know where an existing computer vision model may be useful in the real world. Autoflow is a tool to quickly test out an existing model in the field without going through the difficult steps of deploying an application utilizing the model.

### LLM Inference
Most real-world applications will require a small snippet of logic in order to post process the inference data. To that end, Autoflow can make use of LLMs to generate simple if/then logic to post process the inferences from a given model.

### Limitations
Currently, autoflow is limited to running in-browser, using the browser's available camera. This allows rapid deployment and easy sandboxing of code. In the future, Autoflow will incorporate cloud execution of inferences based on data captured from remote devices.

For immediate roadmap, see TODO.md

