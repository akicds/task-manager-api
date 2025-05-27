# Kubernetes Interview Questions

## Basic Concepts

### 1. What is a Namespace in Kubernetes?

- A namespace provides a scope for resources
- Helps organize and isolate resources
- In our project: `task-manager` namespace isolates our application resources
- Practical Example:
  ```yaml
  # namespace.yaml
  apiVersion: v1
  kind: Namespace
  metadata:
    name: task-manager
    labels:
      environment: development
  ```

### 2. What is a PersistentVolumeClaim (PVC)?

- Requests storage resources from the cluster
- Provides persistent storage for applications
- In our project: `mariadb-pvc` ensures database data persistence
- Practical Example:
  ```yaml
  # pvc.yaml
  spec:
    accessModes:
      - ReadWriteOnce # Single node access
    resources:
      requests:
        storage: 1Gi # Storage size
  ```

### 3. What is the difference between a Deployment and a Service?

- Deployment: Manages pod lifecycle, scaling, and updates
- Service: Provides network access to pods
- In our project:
  - Deployment runs our application containers
  - Service exposes them to the cluster
- Practical Example:
  ```yaml
  # Service connects to Deployment using labels
  spec:
    selector:
      app: task-manager-api # Matches deployment labels
    ports:
      - port: 5002 # Service port
        targetPort: 5002 # Container port
  ```

## Security

### 4. How do we handle sensitive data in Kubernetes?

- Use Secrets for sensitive data (passwords, tokens)
- Never store sensitive data in ConfigMaps
- In our project: Database passwords are stored in Secrets
- Practical Example:
  ```yaml
  # secret.yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: db-credentials
  type: Opaque
  data:
    DB_PASSWORD: ZGV2cGFzcw== # Base64 encoded
  ```

### 5. What is the purpose of Service Accounts?

- Provides identity for pods
- Controls access to the Kubernetes API
- Best practice for pod authentication
- Practical Example:
  ```yaml
  # In our deployment
  spec:
    serviceAccountName: task-manager-sa # (We can add this for better security)
  ```

## Storage

### 6. What is the difference between emptyDir and PersistentVolume?

- emptyDir: Temporary storage, deleted when pod is removed
- PersistentVolume: Long-term storage, survives pod restarts
- In our project: MariaDB uses PVC for data persistence
- Practical Example:
  ```yaml
  # In mariadb deployment
  volumeMounts:
    - name: mariadb-data
      mountPath: /var/lib/mysql # Database files location
  volumes:
    - name: mariadb-data
      persistentVolumeClaim:
        claimName: mariadb-pvc # Our PVC
  ```

### 7. What are the different access modes for volumes?

- ReadWriteOnce (RWO): Single node read-write
- ReadOnlyMany (ROX): Multiple nodes read-only
- ReadWriteMany (RWX): Multiple nodes read-write
- Practical Example:
  ```yaml
  # Our PVC configuration
  spec:
    accessModes:
      - ReadWriteOnce # MariaDB needs single node access
  ```

## Networking

### 8. What are the different types of Services?

- ClusterIP: Internal cluster access (default)
- NodePort: External access via node port
- LoadBalancer: External access via cloud provider
- In our project: Using ClusterIP for internal communication
- Practical Example:

  ```yaml
  # Our services
  # Database service
  spec:
    type: ClusterIP
    ports:
      - port: 3306        # MariaDB port

  # Application service
  spec:
    type: ClusterIP
    ports:
      - port: 5002        # Node.js app port
  ```

### 9. How does service discovery work in Kubernetes?

- Services provide stable endpoints for pods
- DNS resolution within the cluster
- In our project: App connects to DB using service name 'db'
- Practical Example:
  ```yaml
  # In our app deployment
  env:
    - name: DB_HOST
      value: "db" # Service name for MariaDB
  ```

## Best Practices

### 10. What are the best practices for Kubernetes deployments?

- Use namespaces for resource isolation
- Implement health checks
- Use resource limits and requests
- Store sensitive data in Secrets
- Use persistent storage for databases
- Implement proper labels and selectors
- Practical Example from our project:
  ```yaml
  # Labels and selectors
  metadata:
    labels:
      app: task-manager-api
  spec:
    selector:
      matchLabels:
        app: task-manager-api
  ```

### 11. How do you handle application updates?

- Use rolling updates (default in Deployments)
- Implement proper health checks
- Use version tags for images
- Test updates in staging first
- Practical Example:
  ```yaml
  # Our deployment strategy
  spec:
    replicas: 1
    strategy:
      type: RollingUpdate # Default strategy
  ```

### 12. How do you monitor Kubernetes applications?

- Use resource metrics
- Implement health checks
- Set up logging
- Use monitoring tools (Prometheus, Grafana)
- Practical Example:
  ```bash
  # Commands we use
  kubectl get pods -n task-manager
  kubectl logs -n task-manager <pod-name>
  kubectl describe pod -n task-manager <pod-name>
  ```

## Troubleshooting

### 13. How do you debug pod issues?

- Check pod status: `kubectl get pods`
- View pod logs: `kubectl logs <pod-name>`
- Describe pod: `kubectl describe pod <pod-name>`
- Check events: `kubectl get events`
- Practical Example:
  ```bash
  # Debug our application
  kubectl get pods -n task-manager
  kubectl logs -n task-manager task-manager-api-<hash>
  kubectl describe pod -n task-manager task-manager-api-<hash>
  ```

### 14. How do you handle pod crashes?

- Check pod logs
- Verify resource limits
- Check health checks
- Verify environment variables
- Check volume mounts
- Practical Example:
  ```bash
  # Debug MariaDB pod
  kubectl logs -n task-manager mariadb-<hash>
  kubectl describe pod -n task-manager mariadb-<hash>
  kubectl get events -n task-manager
  ```
