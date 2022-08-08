import { act, fireEvent } from '@testing-library/react';

import { minimalRender, screen } from '@/test/test-utils';

import { UploadForm } from '../components/UploadForm';

test('renders the upload form', async () => {
  await minimalRender(<UploadForm />);

  const titleElement = await screen.getByRole('heading', { level: 2 });
  expect(titleElement).toHaveTextContent('Project info');
});

test('switches between steps', async () => {
  await minimalRender(<UploadForm />);

  const goToNextStep = async (title: string) => {
    await act(() => {
      fireEvent.click(screen.getByText(/continue/i));
    });
    const titleElement = await screen.getByRole('heading', { level: 2 });
    expect(titleElement).toHaveTextContent(title);
  };

  await goToNextStep('Project details');
  await goToNextStep('Configuration');
  await goToNextStep('Upload files');
  await goToNextStep('Confirmation');
});

test('submits the empty form counts steps with error', async () => {
  await minimalRender(<UploadForm />);

  await act(() => {
    fireEvent.click(screen.getByRole('button', { name: 'stepper-CONFIRMATION' }));
  });

  await act(() => {
    fireEvent.click(screen.getByText(/I confirm the creation of this project/i));
  });

  await act(() => {
    fireEvent.click(screen.getByText(/send/i));
  });

  const errorIcons = screen.getAllByAltText(/stepper-error-icon/i);
  expect(errorIcons.length).toBe(4);
});
